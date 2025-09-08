import axios, { AxiosInstance } from 'axios'
import * as cheerio from 'cheerio'
import { ScrapingConfig, ScrapingResult } from './types'

export abstract class BaseScraper {
  protected httpClient: AxiosInstance
  protected config: ScrapingConfig

  constructor(config: ScrapingConfig) {
    this.config = config
    this.httpClient = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'User-Agent': config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    })
  }

  protected async delay(ms: number = this.config.delay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected async fetchPage(url: string): Promise<cheerio.CheerioAPI> {
    let retries = 0
    while (retries < this.config.maxRetries) {
      try {
        const response = await this.httpClient.get(url)
        return cheerio.load(response.data)
      } catch (error) {
        retries++
        if (retries >= this.config.maxRetries) {
          throw new Error(`Failed to fetch ${url} after ${this.config.maxRetries} retries: ${error}`)
        }
        await this.delay(1000 * retries) // Exponential backoff
      }
    }
    throw new Error('Unexpected error in fetchPage')
  }

  protected extractText($: cheerio.CheerioAPI, selector: string): string {
    return $(selector).text().trim()
  }

  protected extractHtml($: cheerio.CheerioAPI, selector: string): string {
    return $(selector).html() || ''
  }

  protected extractAttribute($: cheerio.CheerioAPI, selector: string, attribute: string): string {
    return $(selector).attr(attribute) || ''
  }

  protected extractLinks($: cheerio.CheerioAPI, selector: string): string[] {
    const links: string[] = []
    $(selector).each((_, element) => {
      const href = $(element).attr('href')
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`
        links.push(fullUrl)
      }
    })
    return links
  }

  protected cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()
  }

  protected cleanHtml(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim()
  }

  abstract scrape(): Promise<ScrapingResult>
}
