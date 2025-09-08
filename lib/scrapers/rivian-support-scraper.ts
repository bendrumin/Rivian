import { Brand, ChangeType } from '@prisma/client'
import { BaseScraper } from './base-scraper'
import { ScrapingResult, SupportArticleData, StagingIndicator } from './types'
import { prisma } from '../db'

export class RivianSupportScraper extends BaseScraper {
  private stagingIndicators: StagingIndicator[] = [
    {
      text: 'staging',
      pattern: /staging|draft|preview|test/i,
      confidence: 0.9
    },
    {
      text: 'coming soon',
      pattern: /coming soon|not yet available|under development/i,
      confidence: 0.8
    },
    {
      text: 'beta',
      pattern: /beta|experimental|pre-release/i,
      confidence: 0.7
    },
    {
      text: 'placeholder',
      pattern: /placeholder|lorem ipsum|sample text/i,
      confidence: 0.6
    }
  ]

  constructor() {
    super({
      baseUrl: process.env.RIVIAN_SUPPORT_BASE_URL || 'https://rivian.com/support',
      delay: parseInt(process.env.SCRAPE_DELAY_MS || '1000'),
      maxRetries: 3,
      userAgent: 'RivianNewsBot/1.0 (+https://rivian-news.com/bot)',
      timeout: 30000
    })
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log('Starting Rivian support scraping...')
      
      // Use the "*" search trick to discover staging content
      const stagingArticles = await this.discoverStagingContent()
      console.log(`Found ${stagingArticles.length} staging articles`)

      // Scrape regular support articles
      const regularArticles = await this.scrapeRegularArticles()
      console.log(`Found ${regularArticles.length} regular articles`)

      // Process and save all articles
      const allArticles = [...stagingArticles, ...regularArticles]
      const savedArticles = await this.saveArticles(allArticles)

      // Check for changes in existing articles
      await this.detectChanges(allArticles)

      return {
        success: true,
        data: {
          totalArticles: allArticles.length,
          stagingArticles: stagingArticles.length,
          regularArticles: regularArticles.length,
          savedArticles: savedArticles.length
        },
        metadata: {
          scrapedAt: new Date().toISOString(),
          baseUrl: this.config.baseUrl
        }
      }
    } catch (error) {
      console.error('Rivian support scraping failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async discoverStagingContent(): Promise<SupportArticleData[]> {
    const articles: SupportArticleData[] = []
    
    try {
      // Use wildcard search to find all content
      const searchUrl = `${this.config.baseUrl}/search?q=*`
      const $ = await this.fetchPage(searchUrl)
      
      // Look for article links in search results
      const articleLinks = this.extractLinks($, '.search-result a, .article-link, a[href*="/support/"]')
      
      for (const link of articleLinks) {
        try {
          const article = await this.scrapeArticle(link, true)
          if (article) {
            articles.push(article)
          }
          await this.delay()
        } catch (error) {
          console.warn(`Failed to scrape article ${link}:`, error)
        }
      }
    } catch (error) {
      console.error('Failed to discover staging content:', error)
    }

    return articles
  }

  private async scrapeRegularArticles(): Promise<SupportArticleData[]> {
    const articles: SupportArticleData[] = []
    
    try {
      // Scrape main support categories
      const categories = [
        '/support/vehicle',
        '/support/charging',
        '/support/service',
        '/support/account',
        '/support/guides'
      ]

      for (const category of categories) {
        try {
          const $ = await this.fetchPage(category)
          const articleLinks = this.extractLinks($, 'a[href*="/support/"]')
          
          for (const link of articleLinks) {
            try {
              const article = await this.scrapeArticle(link, false)
              if (article) {
                articles.push(article)
              }
              await this.delay()
            } catch (error) {
              console.warn(`Failed to scrape article ${link}:`, error)
            }
          }
        } catch (error) {
          console.warn(`Failed to scrape category ${category}:`, error)
        }
      }
    } catch (error) {
      console.error('Failed to scrape regular articles:', error)
    }

    return articles
  }

  private async scrapeArticle(url: string, isStaging: boolean): Promise<SupportArticleData | null> {
    try {
      const $ = await this.fetchPage(url)
      
      const title = this.extractText($, 'h1, .article-title, .page-title')
      const content = this.extractHtml($, '.article-content, .support-content, .main-content')
      
      if (!title || !content) {
        return null
      }

      // Check for staging indicators
      const stagingScore = this.calculateStagingScore(title + ' ' + content)
      const finalIsStaging = isStaging || stagingScore > 0.5

      return {
        title: this.cleanText(title),
        content: this.cleanHtml(content),
        url,
        brand: Brand.RIVIAN,
        category: this.extractCategory(url),
        isStaging: finalIsStaging,
        lastUpdated: this.extractLastUpdated($)
      }
    } catch (error) {
      console.warn(`Failed to scrape article ${url}:`, error)
      return null
    }
  }

  private calculateStagingScore(text: string): number {
    let score = 0
    const lowerText = text.toLowerCase()

    for (const indicator of this.stagingIndicators) {
      if (indicator.pattern.test(lowerText)) {
        score += indicator.confidence
      }
    }

    return Math.min(score, 1.0)
  }

  private extractCategory(url: string): string | undefined {
    const urlParts = url.split('/')
    const supportIndex = urlParts.indexOf('support')
    if (supportIndex !== -1 && urlParts[supportIndex + 1]) {
      return urlParts[supportIndex + 1]
    }
    return undefined
  }

  private extractLastUpdated($: cheerio.CheerioAPI): Date {
    const dateText = this.extractText($, '.last-updated, .modified-date, .updated')
    if (dateText) {
      const date = new Date(dateText)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    return new Date()
  }

  private async saveArticles(articles: SupportArticleData[]): Promise<number> {
    let savedCount = 0

    for (const article of articles) {
      try {
        await prisma.supportArticle.upsert({
          where: { url: article.url },
          update: {
            title: article.title,
            content: article.content,
            category: article.category,
            isStaging: article.isStaging,
            lastUpdated: article.lastUpdated,
            updatedAt: new Date()
          },
          create: {
            title: article.title,
            content: article.content,
            url: article.url,
            brand: article.brand,
            category: article.category,
            isStaging: article.isStaging,
            lastUpdated: article.lastUpdated
          }
        })
        savedCount++
      } catch (error) {
        console.warn(`Failed to save article ${article.url}:`, error)
      }
    }

    return savedCount
  }

  private async detectChanges(newArticles: SupportArticleData[]): Promise<void> {
    for (const newArticle of newArticles) {
      try {
        const existingArticle = await prisma.supportArticle.findUnique({
          where: { url: newArticle.url }
        })

        if (existingArticle) {
          const changes: any[] = []

          // Check for title changes
          if (existingArticle.title !== newArticle.title) {
            changes.push({
              supportArticleId: existingArticle.id,
              changeType: ChangeType.TITLE_CHANGED,
              oldTitle: existingArticle.title,
              newTitle: newArticle.title
            })
          }

          // Check for content changes
          if (existingArticle.content !== newArticle.content) {
            changes.push({
              supportArticleId: existingArticle.id,
              changeType: ChangeType.CONTENT_CHANGED,
              oldContent: existingArticle.content,
              newContent: newArticle.content
            })
          }

          // Check for staging status changes
          if (existingArticle.isStaging !== newArticle.isStaging) {
            changes.push({
              supportArticleId: existingArticle.id,
              changeType: newArticle.isStaging ? ChangeType.CREATED : ChangeType.UPDATED,
              oldContent: existingArticle.isStaging ? 'staging' : 'published',
              newContent: newArticle.isStaging ? 'published' : 'staging'
            })
          }

          // Save changes
          if (changes.length > 0) {
            await prisma.contentChange.createMany({
              data: changes
            })
          }
        }
      } catch (error) {
        console.warn(`Failed to detect changes for article ${newArticle.url}:`, error)
      }
    }
  }
}
