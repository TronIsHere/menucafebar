import type { IconType } from "react-icons";
import {
  LuApple,
  LuBeef,
  LuBeer,
  LuCake,
  LuCakeSlice,
  LuCandy,
  LuCarrot,
  LuCherry,
  LuChefHat,
  LuClock,
  LuCoffee,
  LuCookie,
  LuCroissant,
  LuCupSoda,
  LuDrumstick,
  LuEgg,
  LuFish,
  LuFlame,
  LuGlassWater,
  LuIceCreamCone,
  LuLeaf,
  LuMartini,
  LuPizza,
  LuPopcorn,
  LuSalad,
  LuSandwich,
  LuSoup,
  LuStar,
  LuUtensilsCrossed,
  LuWine,
} from "react-icons/lu";
import { CATEGORY_ICONS } from "./registry";

export const CATEGORY_ICON_MAP: Record<(typeof CATEGORY_ICONS)[number], IconType> = {
  "lu:LuCoffee": LuCoffee,
  "lu:LuCupSoda": LuCupSoda,
  "lu:LuGlassWater": LuGlassWater,
  "lu:LuWine": LuWine,
  "lu:LuBeer": LuBeer,
  "lu:LuMartini": LuMartini,
  "lu:LuCroissant": LuCroissant,
  "lu:LuEgg": LuEgg,
  "lu:LuSandwich": LuSandwich,
  "lu:LuPizza": LuPizza,
  "lu:LuSoup": LuSoup,
  "lu:LuSalad": LuSalad,
  "lu:LuUtensilsCrossed": LuUtensilsCrossed,
  "lu:LuChefHat": LuChefHat,
  "lu:LuBeef": LuBeef,
  "lu:LuDrumstick": LuDrumstick,
  "lu:LuFish": LuFish,
  "lu:LuCake": LuCake,
  "lu:LuCakeSlice": LuCakeSlice,
  "lu:LuIceCreamCone": LuIceCreamCone,
  "lu:LuCookie": LuCookie,
  "lu:LuCandy": LuCandy,
  "lu:LuApple": LuApple,
  "lu:LuCherry": LuCherry,
  "lu:LuCarrot": LuCarrot,
  "lu:LuLeaf": LuLeaf,
  "lu:LuPopcorn": LuPopcorn,
  "lu:LuFlame": LuFlame,
  "lu:LuStar": LuStar,
  "lu:LuClock": LuClock,
};

export function getCategoryIcon(id?: string): IconType {
  if (id && id in CATEGORY_ICON_MAP) {
    return CATEGORY_ICON_MAP[id as keyof typeof CATEGORY_ICON_MAP];
  }
  return LuUtensilsCrossed;
}
