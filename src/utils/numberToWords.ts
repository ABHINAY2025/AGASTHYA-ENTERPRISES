const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  
  let result = '';
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
    if (num > 0) result += 'and ';
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    result += teens[num - 10] + ' ';
    return result;
  }
  
  if (num > 0) {
    result += ones[num] + ' ';
  }
  
  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  
  let result = '';
  
  if (crore > 0) {
    result += convertLessThanThousand(crore) + 'Crore ';
  }
  
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + 'Lakh ';
  }
  
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + 'Thousand ';
  }
  
  if (num > 0) {
    result += convertLessThanThousand(num);
  }

  // Handling the decimal part (paise)
  const decimalPart = Math.round((num % 1) * 100); // Ensure the decimal part is rounded to 2 decimal places
  
  if (decimalPart > 0) {
    result += 'and ' + convertLessThanThousand(decimalPart) + ' Paise';
  }

  return result.trim() + ' Only';
}
