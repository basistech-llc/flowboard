// Trivial obfuscation.
// [TODO] Good enough, since we're only using it on the user's local machine?

export const obfuscate = (token) => {
  const reversed = token.split("").reverse();
  const xorString = reversed
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ 42))
    .join("");
  return btoa(xorString);
};

export const deobfuscate = (encodedToken) => {
  const xorString = atob(encodedToken);
  const reversed = xorString
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ 42));
  return reversed.reverse().join("");
};
