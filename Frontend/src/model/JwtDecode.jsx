const base64UrlDecode = (base64Url) => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

export const parseJwt = (token)=>{
    const base64Url = token.split('.')[1];
    return base64UrlDecode(base64Url);
  }