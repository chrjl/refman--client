function getEnvFromMeta() {
  const properties = document.head.querySelectorAll('meta[property]');

  return [...properties].reduce((obj, elem) => ({
    ...obj,
    [elem.getAttribute('property')]: elem.getAttribute('value'),
  }), {});
}

export default getEnvFromMeta;
