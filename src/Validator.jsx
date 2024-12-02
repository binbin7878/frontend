const Validator = (target) => {
    // 1. 입력 항목이 비어있는지 확인
    for (let i = 0; i < target.length; i++) {
      const values = Object.entries(target[i]);
      for (let [key, value] of values) {
        if (value === "" || value === null || value === undefined) {
          alert("비어있는 항목이 존재합니다.");
          return { error: true, index: i, field: key };
        }
      }
    }
  
    // 2. 과목명(name) 중복 확인
    for (let i = 0; i < target.length; i++) {
      for (let j = i + 1; j < target.length; j++) {
        
        if (target[i].name === target[j].name && target[i].grade !== "F" && target[j].grade !== "F") {
          alert("중복된 과목명이 존재합니다.");
          return { error: true, index: j, field: "name" };
        }
      }
    }
  
    // 3. 학점이 0보다 작은지 확인
    for (let i = 0; i < target.length; i++) {
      if (Number(target[i].credit) <= 0) {
        alert("학점은 반드시 1점 이상이어야 합니다.");
        return { error: true, index: i, field: "credit" };
      }
    }
  
    // 4. 출석점수, 과제점수 확인
    for (let i = 0; i < target.length; i++) {
      if (Number(target[i].attendance) < 0 || Number(target[i].attendance) > 20) {
        alert("출석점수는 0점이상 20점이하로 입력해주세요.");
        return { error: true, index: i, field: "attendance" };
      }
      if (Number(target[i].assignment) < 0 || Number(target[i].assignment) > 20) {
        alert("과제점수는 0점이상 20점이하로 입력해주세요.");
        return { error: true, index: i, field: "assignment" };
      }
    }
  
    // 5. 중간, 기말 점수 확인
    for (let i = 0; i < target.length; i++) {
      if (Number(target[i].midterm) < 0 || Number(target[i].midterm) > 30) {
        alert("중간고사 점수는 0점이상 30점이하로 입력해주세요.");
        return { error: true, index: i, field: "midterm" };
      }
      if (Number(target[i].finalExam) < 0 || Number(target[i].finalExam) > 30) {
        alert("기말고사 점수는 0점이상 30점이하로 입력해주세요.");
        return { error: true, index: i, field: "finalExam" };
      }
    }
  
    // 6. 과목별 총점 확인
    for (let i = 0; i < target.length; i++) {
      if (
        Number(target[i].totalScore) < 0 ||
        Number(target[i].totalScore) > 100
      ) {
        return { error: true, index: i, field: "totalScore" };
      }
    }
  
    return { error: false };
  };
  
  export default Validator;