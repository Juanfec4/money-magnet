export const getUIAvatarForUsername = (username: string): string => {
  const BASE_URL = "https://ui-avatars.com/api/";
  // Generate random color and determine text color
  const randomColor = getRandomHexColor();
  const textColor = getTextColorForBackground(randomColor);
  // Construct the avatar URL using template literals
  const avatarUrl = `${BASE_URL}?background=${randomColor}&color=${textColor}&name=${username}&length=1`;
  return avatarUrl;
};

export const getRandomHexColor = (): string => {
  // Generate a random hex color code
  const color = Math.floor(Math.random() * 16777215).toString(16);
  // Ensure the color has six digits by padding with zeros if necessary
  return `${color.padStart(6, "0")}`;
};

export const getTextColorForBackground = (hexColor: string): string => {
  // Convert hex color to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate luminance using the relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose text color based on luminance
  return luminance > 0.5 ? "000" : "fff";
};

export const formatMoney = (amount: number): string => {
  // Ensure that the number is a valid finite number
  if (!isFinite(amount)) {
    throw new Error("Invalid input. Please provide a valid number.");
  }

  // Use toLocaleString to add commas and format the number as currency
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD", // Change the currency code as needed
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedAmount;
};
