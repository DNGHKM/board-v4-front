'use client';


import {useEffect, useState} from "react";
import {fetchBoardList} from "@/api/boardApi";
import LatestPostTable from "@/components/board/list/LatestPostTable";
import LatestQnaTable from "@/components/qna/LatestQnaTable";

const Home = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetchBoardList()
            .then(data => {
                setBoards(data)
            }).catch(() => alert("게시판을 불러오지 못했습니다."));
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                {boards.map(board => (
                    <div key={board.boardId} className="col-md-6 mb-4">
                        <LatestPostTable board={board}/>
                    </div>
                ))}
                <div className="col-md-6 mb-4">
                    <LatestQnaTable/>
                </div>
            </div>
        </div>
    );
};
export default Home