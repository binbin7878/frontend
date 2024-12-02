import React from "react";
import { useState, useRef, createRef } from "react";
import Validator from "./Validator";
import './Calculator.css';

function Calculator() {

    const [courses, setCourses] = useState([]);

    const [totalCredit, setTotalCredit] = useState();
    const [totalAttend, setTotalAttend] = useState();
    const [totalAssign, setTotalAssign] = useState();
    const [totalMidterm, setTotalMideterm] = useState();
    const [totalFinal, setTotalFinal] = useState();
    const [totalOfTotal, setTotalofTotal] = useState();
    const [average, setAverage] = useState();
    const [averageGrade, setAverageGrade] = useState();

    const [selectedRow, setSelectedRow] = useState();
    const [visible, setVisible] = useState(false);

    const courseRefs = useRef(
        courses.map(() => ({
            type: createRef(),
            essential: createRef(),
            name: createRef(),
            credit: createRef(),
            attendance: createRef(),
            assignment: createRef(),
            midterm: createRef(),
            finalExam: createRef(),
            totalScore: createRef(),
            grade: createRef(),
        }))
    );

    const onClickAddCourse = () => {
        setVisible(false);
        const newRef = {
            type: createRef(),
            essential: createRef(),
            name: createRef(),
            credit: createRef(),
            attendance: createRef(),
            assignment: createRef(),
            midterm: createRef(),
            finalExam: createRef(),
            totalScore: createRef(),
            grade: createRef(),
        };

        courseRefs.current = [...courseRefs.current, newRef];

        setCourses([
            ...courses,
            {
                type: "교양",
                essential: "선택",
                name: "",
                credit: 0,
                attendance: 0,
                assignment: 0,
                midterm: 0,
                finalExam: 0,
                totalScore: 0,
                grade: "Pass",
            },
        ]);
    };

    const handleInputChange = (e, index) => {

        var { name, value } = e.target;
        if (value === "Pass" || value === "NonePass") {
            const newCourses = [...courses];
            newCourses[index][name] = value;
            newCourses[index].totalScore = 0;  // Pass/NonePass일 때는 점수 0
            setCourses(newCourses);
            return;

        }
        const newCourses = [...courses];
        newCourses[index][name] = value;
        newCourses[index].totalScore = CalculateTotal(index);

        if (name !== "grade") {
            newCourses[index].grade = CalculateGrade(newCourses[index].totalScore);
        }

        setCourses(newCourses);
    }; //한 행에서 이뤄지는 값의 변화들을 다루는 함수

    function CalculateTotal(index) {
        var Total =
            Number(courses[index].assignment) +
            Number(courses[index].attendance) +
            Number(courses[index].midterm) +
            Number(courses[index].finalExam);
        return Total;
    } //한 행의 총점을 계산하는 함수

    function CalculateGrade(score) {
        if (score === 0) {
            return "Pass";  // Pass일 경우 점수가 0이면 Pass 처리
        }
        if (score >= 95) {
            return "A+";
        } else if (score >= 90) {
            return "A0";
        } else if (score >= 85) {
            return "B+";
        } else if (score >= 80) {
            return "B0";
        } else if (score >= 75) {
            return "C+";
        } else if (score >= 70) {
            return "C0";
        } else if (score >= 65) {
            return "D+";
        } else if (score >= 60) {
            return "D0";
        } else {
            return "F";
        }
    } //A+ , A, B+ ... 계산하는 함수

    const OnClickRow = (index) => {
        setSelectedRow(index);
    };

    const handleDelete = (index) => {
        const newCourses = [...courses];
        newCourses.splice(index, 1);
        setCourses(newCourses);
    };

    const OnClickSave = () => {


        const validationResult = Validator(courses);
        if (validationResult.error) {
            const errorIndex = validationResult.index;
            const errorField = validationResult.field;
            console.log(
                "Error field : " + errorField + ", Error index : " + errorIndex
            );
            courseRefs.current[errorIndex][errorField].current.focus();
            return;
        } else {
            setVisible(true);
            Validator(courses);
            sortCourses();
            var credit = 0;
            var attend = 0;
            var assign = 0;
            var midterm = 0;
            var final = 0;
            var total = 0;
            var cnt = 0;

            for (let i = 0; i < courses.length; i++) {
                console.log(courses[i].grade)
                if (courses[i].grade === "Pass") {
                    credit++;
                    continue;
                }
                if (courses[i].grade === "NonePass") {
                    credit++;
                    continue;
                }

                cnt++;
                credit += Number(courses[i].credit);
                attend += Number(courses[i].attendance);
                assign += Number(courses[i].assignment);
                midterm += Number(courses[i].midterm);
                final += Number(courses[i].finalExam);
                total += Number(courses[i].totalScore);
            }
            setTotalCredit(credit);
            setTotalAttend(attend);
            setTotalAssign(assign);
            setTotalMideterm(midterm);
            setTotalFinal(final);
            setTotalofTotal(total);
            setAverage((Math.round((total / cnt) * 100) / 100).toFixed(2));
            setAverageGrade(CalculateGrade(total / cnt));
        }
    };

    const sortCourses = () => {
        const sortedArray = [...courses].sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            if (a.essential < b.essential) return -1;
            if (a.essential > b.essential) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        setCourses(sortedArray);
    };

    return (
        <div style={{ margin: "50px 50px 0px 50px" }}>
            <div style={{ float: "left" }}>
                <select>
                    <option value='1학년'>1학년</option>
                    <option value='2학년'>2학년</option>
                    <option value='3학년'>3학년</option>

                </select>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginLeft: "75%",
                    marginRight: "4%",
                }}
            >
                <button onClick={onClickAddCourse}>추가</button>
                <button onClick={() => handleDelete(selectedRow)}>삭제</button>
                <button onClick={OnClickSave}>저장</button>

            </div>
            <div style={{ width: "90%", margin: "0% 5% 0% 5%" }}>
                <table className="grade-table">
                    <thead>
                        <tr>
                            <td className="styleHeader">이수</td>
                            <td className="styleHeader">필수</td>
                            <td className="styleHeader">과목명</td>
                            <td className="styleHeader">학점</td>
                            <td className="styleHeader">출석점수</td>
                            <td className="styleHeader">과제점수</td>
                            <td className="styleHeader">중간고사</td>
                            <td className="styleHeader">기말고사</td>
                            <td className="styleHeader">총점</td>
                            <td className="styleHeader">평균</td>
                            <td className="styleHeader">성적</td>
                        </tr>

                    </thead>
                    <tbody>
                        {courses.map((course, index) => (



                            <tr onClick={() => OnClickRow(index)} key={index} >
                                <td align="center" >
                                    <select name="type" value={course.type} onChange={(e) => handleInputChange(e, index)}>
                                        <option value='교양'>교양</option>
                                        <option value='전공'>전공</option>
                                    </select>
                                </td>
                                <td align="center" >
                                    <select name="essential" value={course.essential} onChange={(e) => handleInputChange(e, index)}>
                                        <option value='선택'>선택</option>
                                        <option value='필수'>필수</option>

                                    </select>
                                </td>
                                <td>
                                    
                                    <input align="left" className="input-field" ref={courseRefs.current[index].name} name="name" value={course.name} onError={courses.map((item) => item.name).filter((element) =>
                                        course.name === element).length > 1 && course.name !== "" ? true : false} onChange={(e) => handleInputChange(e, index)} type="text">

                                    </input>
                                </td>
                                <td>
                                    <input className="input-field" type="number" ref={courseRefs.current[index].credit} name="credit" value={course.credit} onError={course.credit < 0 || isNaN(course.credit)
                                        ? true : false
                                    } onChange={(e) => handleInputChange(e, index)}></input>
                                </td>
                                <td >
                                    {course.credit === "1" ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <input className="input-field" type="number" ref={courseRefs.current[index].attendance} name="attendance" value={course.attendance} onError={course.attendance < 0 || course.attendance > 20 ||
                                                isNaN(course.attendance)
                                                ? true : false
                                            } onChange={(e) => handleInputChange(e, index)}></input>
                                        </div>
                                    )}
                                </td>
                                <td >
                                    {course.credit === "1" ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <input className="input-field" type="number" ref={courseRefs.current[index].assignment} name="assignment" value={course.assignment} onError={course.assignment < 0 || course.assignment > 20 ||
                                                isNaN(course.assignment)
                                                ? true : false
                                            } onChange={(e) => handleInputChange(e, index)}></input>
                                        </div>
                                    )}
                                </td>
                                <td >
                                    {course.credit === "1" ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <input className="input-field" type="number" ref={courseRefs.current[index].midterm} name="midterm" value={course.midterm} onError={course.midterm < 0 || course.midterm > 30 ||
                                                isNaN(course.midterm)
                                                ? true : false
                                            } onChange={(e) => handleInputChange(e, index)}></input>
                                        </div>
                                    )}
                                </td>
                                <td >
                                    {course.credit === "1" ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <input className="input-field" type="number" ref={courseRefs.current[index].finalExam} name="finalExam" value={course.finalExam} onError={course.finalExam < 0 || course.finalExam > 30 ||
                                                isNaN(course.finalExam)
                                                ? true : false
                                            } onChange={(e) => handleInputChange(e, index)}></input>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {course.credit === "1" ? (<div></div>) : (
                                        <div>{visible ? course.totalScore : ""}</div>
                                    )}
                                </td>
                                <td></td>
                                <td style={course.grade === "F" ? { color: 'red' } : { color: 'black' }}>
                                    {course.credit === "1" ? (
                                        visible ? (course.grade) : (
                                            <select name="grade" value={course.grade} onChange={(e) => {
                                                handleInputChange(e, index)

                                            }}>
                                                <option value="Pass">Pass</option>
                                                <option value="NonePass">None Pass</option>
                                            </select>)
                                    ) : visible ? (course.grade) : ("")}

                                </td>
                            </tr>

                        ))}
                        <tr className="total">
                            <td colSpan={3} align="center">합계</td>
                            <td align="center">{visible ? totalCredit : ""}</td>
                            <td align="center">{visible ? totalAttend : ""}</td>
                            <td align="center">{visible ? totalAssign : ""}</td>
                            <td align="center">{visible ? totalMidterm : ""}</td>
                            <td align="center">{visible ? totalFinal : ""}</td>
                            <td align="center">{visible ? totalOfTotal : ""}</td>
                            <td align="center">{visible ? average : ""}</td>
                            <td align="center" style={averageGrade==="F"?{color:'red'}:{color:'black'}}>{visible ? averageGrade : ""}</td>

                        </tr>
                    </tbody>

                </table>




            </div>


        </div>
    )

}

export default Calculator;