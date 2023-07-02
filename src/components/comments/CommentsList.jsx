import React, { useEffect, useState } from "react";

import { dbService } from "fbase";
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";

import { useParams } from "react-router-dom";
import { styled } from "styled-components";

const CommentsList = () => {
  const { contentsId } = useParams();
  // console.log("CommentsList.jsx 현재 게시글 id => ", contentsId)

  const [cmtList, setCmtList] = useState([]);
  const getCommentsQuery = async () => {
    const q = query(
      collection(dbService, "comments"),
      where("contentsId", "==", contentsId),
      orderBy("commentsDate", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const commentsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // useState로 불러온 commentsList state에 담아서 렌더링
    setCmtList(commentsList);
  }

  // Fetch 무한루프 추정 원인 : [cmtList] -> [contentsId]
  useEffect(() => {
    getCommentsQuery();
  }, [contentsId]);

  return (
    <>
      {cmtList.length > 0 ? (
        cmtList.map((comment) => (
          <CommentsWrapper key={comment?.id}>
            <span>결재자: <span>{comment.commentsWriterName}</span></span>
            <span>결재 시간: <span>{comment.commentsDate}</span></span>
            <p>결재 여부: <span>{comment.commentsOpinion}</span></p>
            <p>결재 의견: <span>{comment.commentsBody}</span></p>
          </CommentsWrapper>
        ))
      ) : (
        <NoComments>등록된 댓글이 없습니다.</NoComments>
      )}
    </>
  )  
};

const CommentsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
  margin: 0 auto 30px;
  padding: 60px 100px 50px;
  line-height: 1.4;
  border-radius: 30px;
  background-color: #ffeee6;

  &:last-of-type {
    margin-bottom: 50px;
  }

  & > span {
    position: absolute;
    top: 20px;
    padding: 10px 20px;
    border-radius: 21px;
    background-color: #fff;

    font-size: 18px;
    font-weight: 500;
  }

  & > span:first-child {
    left: 30px;
  }

  & > span:nth-child(2) {
    right: 30px;
  }

  & > span > span {
    font-weight: 600;
    color: #df7951;
  }

  & > p {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.7px;
    color: #333;
  }

  & > p:first-of-type {
    margin-top: 30px;
  }

  & > p > span {
    margin-left: 5px;
    font-size: 19px;
    font-weight: 600;
    color: #df7951;
  }
`;

const NoComments = styled.p`
  margin-bottom: 50px;
`

export default CommentsList;