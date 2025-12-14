/**
 * 统一存储接口
 * 支持多种云存储提供商，方便迁移
 */

export interface StorageProvider {
  /**
   * 上传文件
   * @param file 文件对象
   * @param filename 文件名
   * @returns 文件的公开访问 URL
   */
  uploadFile(file: Buffer, filename: string, contentType: string): Promise<string>

  /**
   * 上传缩略图
   * @param thumbnail 缩略图 Buffer
   * @param filename 文件名
   * @returns 缩略图的公开访问 URL
   */
  uploadThumbnail(thumbnail: Buffer, filename: string): Promise<string>

  /**
   * 删除文件
   * @param url 文件的 URL
   */
  deleteFile(url: string): Promise<void>
}

