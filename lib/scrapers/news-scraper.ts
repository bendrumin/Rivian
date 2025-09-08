import { Brand, ArticleCategory } from '@prisma/client'
import { BaseScraper } from './base-scraper'
import { ScrapingResult, ArticleData } from './types'

export class NewsScraper extends BaseScraper {
  private newsSources = [
    {
      name: 'Rivian News',
      url: 'https://rivian.com/news',
      brand: Brand.RIVIAN,
      selectors: {
        articles: '.news-item, .article-card, .post',
        title: 'h2, h3, .title',
        content: '.excerpt, .summary, .description',
        link: 'a',
        date: '.date, .published, time'
      }
    },
    {
      name: 'Scout Motors News',
      url: 'https://scoutmotors.com/news',
      brand: Brand.SCOUT,
      selectors: {
        articles: '.news-item, .article-card, .post',
        title: 'h2, h3, .title',
        content: '.excerpt, .summary, .description',
        link: 'a',
        date: '.date, .published, time'
      }
    }
  ]

  constructor() {
    super({
      baseUrl: '',
      delay: parseInt(process.env.SCRAPE_DELAY_MS || '1000'),
      maxRetries: 3,
      userAgent: 'RivianNewsBot/1.0 (+https://rivian-news.com/bot)',
      timeout: 30000
    })
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log('Starting news scraping...')
      const allArticles: ArticleData[] = []

      for (const source of this.newsSources) {
        try {
          const articles = await this.scrapeSource(source)
          allArticles.push(...articles)
          await this.delay()
        } catch (error) {
          console.warn(`Failed to scrape ${source.name}:`, error)
        }
      }

      return {
        success: true,
        data: {
          totalArticles: allArticles.length,
          sources: this.newsSources.length
        },
        metadata: {
          scrapedAt: new Date().toISOString(),
          sources: this.newsSources.map(s => s.name)
        }
      }
    } catch (error) {
      console.error('News scraping failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async scrapeSource(source: any): Promise<ArticleData[]> {
    const articles: ArticleData[] = []
    
    try {
      const $ = await this.fetchPage(source.url)
      const articleElements = $(source.selectors.articles)

      articleElements.each((_, element) => {
        try {
          const $element = $(element)
          const title = $element.find(source.selectors.title).text().trim()
          const content = $element.find(source.selectors.content).text().trim()
          const link = $element.find(source.selectors.link).attr('href') || ''
          const dateText = $element.find(source.selectors.date).text().trim()

          if (title && content && link) {
            const fullUrl = link.startsWith('http') ? link : `${source.url}${link}`
            const publishedAt = this.parseDate(dateText) || new Date()

            articles.push({
              title: this.cleanText(title),
              content: this.cleanText(content),
              url: fullUrl,
              source: source.name,
              category: this.categorizeArticle(title, content),
              brand: source.brand,
              tags: this.extractTags(title, content),
              isStaging: false,
              publishedAt
            })
          }
        } catch (error) {
          console.warn(`Failed to parse article element:`, error)
        }
      })
    } catch (error) {
      console.error(`Failed to scrape source ${source.name}:`, error)
    }

    return articles
  }

  private categorizeArticle(title: string, content: string): ArticleCategory {
    const text = (title + ' ' + content).toLowerCase()
    
    if (text.includes('rumor') || text.includes('leak') || text.includes('speculation')) {
      return ArticleCategory.RUMOR
    }
    if (text.includes('review') || text.includes('test drive') || text.includes('impression')) {
      return ArticleCategory.REVIEW
    }
    if (text.includes('analysis') || text.includes('breakdown') || text.includes('deep dive')) {
      return ArticleCategory.ANALYSIS
    }
    if (text.includes('official') || text.includes('announcement') || text.includes('press release')) {
      return ArticleCategory.OFFICIAL_UPDATE
    }
    if (text.includes('blog') || text.includes('opinion') || text.includes('editorial')) {
      return ArticleCategory.BLOG
    }
    
    return ArticleCategory.NEWS
  }

  private extractTags(title: string, content: string): string[] {
    const text = (title + ' ' + content).toLowerCase()
    const tags: string[] = []

    // Vehicle-related tags
    if (text.includes('r1t') || text.includes('r1s')) tags.push('R1T', 'R1S')
    if (text.includes('edv')) tags.push('EDV')
    if (text.includes('scout')) tags.push('Scout')
    
    // Technology tags
    if (text.includes('battery') || text.includes('charging')) tags.push('Battery')
    if (text.includes('autonomous') || text.includes('self-driving')) tags.push('Autonomous')
    if (text.includes('software') || text.includes('ota')) tags.push('Software')
    
    // Business tags
    if (text.includes('production') || text.includes('manufacturing')) tags.push('Production')
    if (text.includes('delivery') || text.includes('shipping')) tags.push('Delivery')
    if (text.includes('service') || text.includes('repair')) tags.push('Service')

    return Array.from(new Set(tags)) // Remove duplicates
  }

  private parseDate(dateText: string): Date | null {
    if (!dateText) return null
    
    try {
      const date = new Date(dateText)
      if (!isNaN(date.getTime())) {
        return date
      }
    } catch (error) {
      // Try to parse common date formats
      const formats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\w+)\s+(\d{1,2}),\s+(\d{4})/
      ]
      
      for (const format of formats) {
        const match = dateText.match(format)
        if (match) {
          try {
            return new Date(dateText)
          } catch (error) {
            continue
          }
        }
      }
    }
    
    return null
  }
}
