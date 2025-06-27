import {formatDateTime} from "@/utils/dateUtils";

const QnaInfo = ({qna}) => {
    return (
        <div className="qna-info">

            {/* 상단 정보 영역 */}
            <div className="pb-3 mb-4 border-bottom">
                <div className="d-flex justify-content-between flex-wrap align-items-center text-dark fs-5">
                    <div>
                        <span className="me-3">
                            작성자: <span className="fw-normal">{qna.writerName}</span>
                        </span>
                    </div>
                    <div className="d-flex gap-4 mt-2 mt-md-0">
                        <div>
                            등록일시: <span className="fw-normal">{formatDateTime(qna.questionAt)}</span>
                        </div>
                        <div>
                            조회수: <span className="fw-normal">{qna.viewCount + 1}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 제목 */}
            <h3 className="fw-bold text-dark mb-4">
                <span id="subject" className="text-break">{qna.subject}</span>
            </h3>

            {/* 본문 내용 */}
            <div
                id="content"
                className="qna-content p-4 bg-light rounded border"
                style={{whiteSpace: "pre-line", lineHeight: "1.75",
                    minHeight: "400px"}}
            >
                {qna.content}
            </div>

            {/* 답변 영역 */}
            {qna.answer && (
                <div className="qna-answer-box mt-5 p-4 border rounded bg-white shadow-sm">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">답변자: {qna.answererName}</span>
                        <span className="text-muted small">{formatDateTime(qna.answerAt)}</span>
                    </div>
                    <div
                        className="qna-answer-content mt-2 text-dark"
                        style={{whiteSpace: "pre-line", lineHeight: "1.75", fontSize: '1rem'}}
                    >
                        {qna.answer}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QnaInfo;