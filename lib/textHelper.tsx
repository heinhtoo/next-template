export function getInitials(name: string | undefined) {
  let initials = "";
  const nameArray = name?.split(" ");

  nameArray?.forEach((word) => {
    if (initials.length < 2) {
      initials += word.charAt(0).toUpperCase();
    }
  });

  if (initials.length === 2) {
    return initials;
  } else {
    return `${name?.charAt(0).toUpperCase()}${name?.charAt(1).toUpperCase()}`;
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatAmount(amount: number | undefined | null) {
  if (amount) return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return "0";
}
