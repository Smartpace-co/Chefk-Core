const filterSubjects = (data) => {
  return data.reduce((acc, curr) => {
    let subName = curr.data.subject;

    let index = acc.indexOf(subName);
    if (index !== -1) {
      return [...acc];
    }
    return [...acc, subName];
  }, []);
};


const extractGradeLevel = (str) => {
  let num = -1;
  let level = 1;
  for (let i = 0; i < str.length; i++) {
    let curr = str[i];
    if (isNaN(curr)) break;

    if (num === -1) num = 0;
    curr = Number(curr);

    num = num * level + curr;
    level *= 10;
  }

  return num;
};

/**
 * fotmat data in clever difference with our data espicallyl in grade title
 * 
 */
const getGradeIdBasedCleverGrade = (grades, gradeName) => {

  let res = null;
  gradeName = gradeName.toLowerCase();

  let isCleverGradeNum = !isNaN(gradeName);

  for (let i = 0; i < grades.length; i++) {
    const currGrade = grades[i].grade.toLowerCase();
    if (currGrade === gradeName) {
      res = grades[i].id;
      break;
    }
    // deep check, because we store data ['Kindergarten', '1st', '2nd', '3rd', '4th', '5th']
    // we try to constract number and compare it with clever_value
    if (isCleverGradeNum) {
      // #TODO: using regex instead of this function later
      const num = extractGradeLevel(grades[i].grade);
      if (num === Number(gradeName)) {
        res = grades[i].id;
        break;
      }
    }
  }
  return res;
};

// two object has the same keys
const getKyesDiffrent = (oldObj, newObj)=> {
  let kyes = Object.keys(oldObj);
  let res = {};
  return kyes.reduce((acc, curr)=> {
    if(oldObj[curr] !== newObj[curr]){
      return {...acc, [curr]: newObj[curr]}
    }else {
      return acc;
    }
  }, {})
}

module.exports = {
  filterSubjects,
  getGradeIdBasedCleverGrade,
  getKyesDiffrent
}
