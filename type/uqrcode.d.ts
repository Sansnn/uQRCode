/**
 * UQRCode
 */
interface UQRCode {
  /**
   * 二维码对应内容
   */
  data: string | number;
  /**
   * 二维码大小
   */
  size: number;
  /**
   * 二维码版本
   */
  typeNumber: number;
}
