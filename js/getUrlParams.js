const getAllUrlParams = () => {
  return Object.fromEntries(  
      new URL(document.location).searchParams
  )
}
