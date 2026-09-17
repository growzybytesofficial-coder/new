/**
 * Convert numbers to Indian Rupees in words (e.g. 1650 -> "One Thousand Six Hundred Fifty Rupees Only")
 */
export function numberToWordsINR(amount) {
  if (amount === 0 || isNaN(amount)) return 'Zero Rupees Only'

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]
  const b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ]

  const num = Math.floor(Math.abs(amount))
  const paise = Math.round((Math.abs(amount) - num) * 100)

  function convertTwoDigits(n) {
    if (n < 20) return a[n]
    return (b[Math.floor(n / 10)] + ' ' + a[n % 10]).trim()
  }

  function convertThreeDigits(n) {
    let str = ''
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n > 0) {
      str += convertTwoDigits(n)
    }
    return str.trim()
  }

  let words = ''
  let crore = Math.floor(num / 10000000)
  let remainder = num % 10000000

  let lakh = Math.floor(remainder / 100000)
  remainder = remainder % 100000

  let thousand = Math.floor(remainder / 1000)
  remainder = remainder % 1000

  let hundred = remainder

  if (crore > 0) {
    words += convertThreeDigits(crore) + ' Crore '
  }
  if (lakh > 0) {
    words += convertThreeDigits(lakh) + ' Lakh '
  }
  if (thousand > 0) {
    words += convertThreeDigits(thousand) + ' Thousand '
  }
  if (hundred > 0) {
    words += convertThreeDigits(hundred) + ' '
  }

  words = words.trim()
  if (!words) words = 'Zero'

  let result = words + ' Rupees'
  if (paise > 0) {
    result += ' and ' + convertTwoDigits(paise) + ' Paise'
  }
  result += ' Only'

  return result
}
