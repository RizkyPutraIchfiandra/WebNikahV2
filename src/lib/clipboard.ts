/** Salin teks ke papan klip dengan fallback untuk peramban/konteks lama. */
export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();

  const succeeded = document.execCommand("copy");
  area.remove();

  if (!succeeded) throw new Error("copy-failed");
}
