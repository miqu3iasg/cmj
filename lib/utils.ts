import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomId(size = 6) {
  const nums = '1234567890';
  const id: Array<string> = [];

  for (let i = 0; i <= size; i++) {
    const randomNum = nums[Math.floor(nums.length * Math.random())];

    id[i] = randomNum;
  }

  return Number(id.join(''));
}
