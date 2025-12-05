function salvarProgresso(bens, processados) {
  localStorage.setItem("inventario", JSON.stringify({ bens, processados: [...processados] }));
}
