import jsonp from 'jsonp'

export default function JSONP(url, option){
  return new Promise((resolve, reject) => {
    const _url = url.indexOf("http") == 0 ? url : process.env.BASE_API + url;
    console.log(_url);
    jsonp(_url, option, (err, data) => {
      if (!err) {
        console.log(data)
        resolve(data);
      } else {
        console.log(err);
        reject(err);
      }
    })
  })
};
