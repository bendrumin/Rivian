import { Brand, ArticleCategory, ChangeType, JobType, JobStatus } from '@prisma/client'

export interface ScrapingResult {
  success: boolean
  data?: any
  error?: string
  metadata?: Record<string, any>
}

export interface ArticleData {
  title: string
  content: string
  url: string
  source: string
  category: ArticleCategory
  brand: Brand
  tags: string[]
  isStaging: boolean
  publishedAt: Date
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
}

export interface SupportArticleData {
  title: string
  content: string
  url: string
  brand: Brand
  category?: string
  isStaging: boolean
  lastUpdated: Date
}

export interface ContentChangeData {
  changeType: ChangeType
  oldContent?: string
  newContent?: string
  oldTitle?: string
  newTitle?: string
}

export interface ScrapingJobData {
  jobType: JobType
  status: JobStatus
  startedAt?: Date
  completedAt?: Date
  error?: string
  metadata?: Record<string, any>
}

export interface ScrapingConfig {
  baseUrl: string
  delay: number
  maxRetries: number
  userAgent: string
  timeout: number
}

export interface StagingIndicator {
  text: string
  pattern: RegExp
  confidence: number
}
