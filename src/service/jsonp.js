import jsonp from 'jsonp'

export default function JSONP(url, option){
  return new Promise((resolve, reject) => {
    jsonp(process.env.BASE_API + url, option, (err, data) => {
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
