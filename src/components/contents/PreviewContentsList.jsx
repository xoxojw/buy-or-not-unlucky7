import Login from "components/authentication/Login";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import { useDispatch, useSelector } from "react-redux";
import { fetchContents } from "redux/modules/contents";
import { styled } from "styled-components";

const PreviewContentsList = () => {
  //hooks
  const currentUser = useSelector((state) => state.auth.user);
  //(리듀서에서 가져옴)
  const contents = useSelector((state) => state.contents);

  //
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //❷Read
  // 1.useEffect(()=>{}, [])로 인해, 메인페이지 처음 로드될 때는 fetchData()를 무조건 실행
  useEffect(() => {
    const fetchData = async () => {
      //
      const q = query(collection(dbService, "contents"));
      const querySnapshot = await getDocs(q);

      const contents_list = [];

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }; // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있음

        console.log("2. getDocs로 내려지는 데이터 =>", data);
        contents_list.push(data);
      });

      dispatch(fetchContents(contents_list));

      // 2.상세페이지에서 리듀서 업데이트 하는 부분을 주석처리했는데도 fB 업데이트뿐만 아니라 화면 업데이트도 되는 이유는, fetchContents(contents_list)가 화면 로드시 실행되어서.

      // dispatch(
      //   {
      //     type: FETCH_CONTENTS,
      //     payload: contents_list
      //   }
      // )
    };

    //fetchData() 호출해서, DB 데이터 클라이언트쪽으로 가져오기
    fetchData();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({top:0, behavior: 'smooth'});
  };

  // //❸Update
  // const updateContents = async (event) => {
  //   //
  //   const contentsRef = doc(db, "contents", contents.id);
  //   await updateDoc(contentsRef, { ...contents, isDone: !contents.isDone });

  const onAddContentsClick = () => {
    if (currentUser) {
      // AddContents page
      // <Link to={"/contentsForm"}>새로운 결제 요청하기</Link>;
      navigate("/contentsForm");
    } else {
      alert("로그인 해주세요!");
      // 로그인 창 띄우기 추가
    }
  };

  //--------------------------------------------------------------------------//
  return (
    <Container>
      <NewContentButton onClick={onAddContentsClick}>새로운 결재 요청하기</NewContentButton>
      <ul>
        {/* 가져온 DB data 클라이언트쪽에 보여주기 */}
        {contents.map((content) => {
          return (
            <ContentsList>
              <ContentPreview key={content?.id}>
                <p>{} 0000년 0월 0일 결재 요청건</p>
                <p>결재요청자: <span>{content.contentsWriterName}</span></p>
                <p>결재 품목: <span>{content.itemPriceText}</span></p>
                <p>결재 요청 사유: <span>{content.wishReasonText}</span></p>
                <p>결재를 검토하시겠습니까?</p>
                <DetailContentButton to={`/detail/${content.id}`}>결재 검토하기</DetailContentButton>
              </ContentPreview>
            </ContentsList>
          );
        })}
      </ul>
      <TopButton onClick={handleScrollToTop}> ▲ </TopButton>
    </Container>
  );
};

const Container = styled.section`
  padding-top: 150px;
  width: 60%;
  margin: 0 auto;
  text-align: center;
`

const NewContentButton = styled.button`
  display: inline-block;
  width: 250px;
  height: 50px;
  margin-bottom: 50px;

  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 50px;
  text-align: center;
  
  border-radius: 25px;
  box-shadow: 3px 3px 5px #ddd;

  background-color: #5aceb1;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #39c4a1;
    color: #fff;
  }
`

const ContentsList = styled.li`
`

const ContentPreview = styled.div`
  padding: 30px 50px;
  margin-bottom: 50px;

  border-radius: 30px;
  background-color: aliceblue;
  
  box-shadow: 5px 5px 10px #eee;

  transition: 0.2s;

  &:hover {
    transform: scale(1.03);
  }

  & > p {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.7px;
  }

  & > p:first-child {
    margin-bottom: 30px;
    font-size: 22px;
    font-weight: 600;
    color: #182646; 
  }

  & > p:nth-child(4) {
    margin-bottom: 50px;
  }

  & > p > span {
    margin-left: 5px;
    font-size: 19px;
    font-weight: 600;
    color: #244eaa;
  }
`
const DetailContentButton = styled(Link)`
  display: inline-block;
  width: 150px;
  height: 40px;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 40px;
  text-align: center;
  
  border-radius: 20px;
  box-shadow: 3px 3px 5px #ddd;

  background-color: #4c6db6;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #2950a3;
    color: #fff;
  }
`

const TopButton = styled.button`
  position: fixed;
  bottom: 50px;
  right: 50px;

  width: 70px;
  height: 70px;

  border-radius: 50%;
  box-shadow: 3px 3px 3px #ddd;

  font-size: 25px;
  font-weight: 800;
  line-height: 65px;

  background-color: rgb(201, 232, 255);
  color: #517a99;

  transition: 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: rgb(163, 207, 240);
  }
`

export default PreviewContentsList;
