type Meal = {
  drinks?: string;
  protein?: string;
  vegetarian?: string;
  sides?: string | string[];
  fruit?: string;
  bakery?: string;
  calories?: string;
  mainDish?: string;
  secondOption?: string;
  drink?: string;
  dessert?: string;
};

export type DailyMenu = {
  dayIndex: number;
  dayName: string;
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
};

export type WeeklyMenu = {
  days: DailyMenu[]
}