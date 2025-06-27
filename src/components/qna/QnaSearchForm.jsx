import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import {formatDate} from "@/utils/dateUtils";
import useAuthStore from "@/store/authStore";
import SearchButtons from "@/components/common/SearchButtons";

const QnaSearchForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {query} = useRouter();
    const {isLoggedIn} = useAuthStore();

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);


    // 검색 조건 초기화
    const [startDate, setStartDate] = useState(() => query.startDate || formatDate(oneYearAgo));
    const [endDate, setEndDate] = useState(() => query.endDate || formatDate(today));
    const [keyword, setKeyword] = useState(() => query.keyword || "");
    const [sortBy, setSortBy] = useState(() => query.sortBy || "CREATE_DATE");
    const [sortDirection, setSortDirection] = useState(() => query.sortDirection || "DESC");
    const [size, setSize] = useState(() => parseInt(query.size) || 10);
    const [myQna, setMyQna] = useState(() => query.myQna === "true");

    useEffect(() => {
        setStartDate(query.startDate || formatDate(oneYearAgo));
        setEndDate(query.endDate || formatDate(today));
        setKeyword(query.keyword || "");
        setSortBy(query.sortBy || "CREATE_DATE");
        setSortDirection(query.sortDirection || "DESC");
        setSize(parseInt(query.size) || 10);
        setMyQna(query.myQna === "true");
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 입력해 주세요.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("시작일은 종료일보다 이전이어야 합니다.");
            return;
        }

        const queryObj = {
            page: "1",
            size: size.toString(),
            startDate,
            endDate,
            sortBy,
            sortDirection,
        };

        if (keyword) queryObj.keyword = keyword;
        if (myQna) queryObj.myQna = "true";

        router.push({
            pathname: router.pathname,
            query: queryObj,
        });
    };

    const handlemyQnaToggle = (checked) => {
        setMyQna(checked);

        const params = new URLSearchParams(searchParams.toString());

        if (checked) params.set("myQna", "true");
        else params.delete("myQna");

        params.set("page", "1");

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
        });
    };


    const handleSortChange = (newSortBy, newSortDirection) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newSortBy) params.set("sortBy", newSortBy);
        if (newSortDirection) params.set("sortDirection", newSortDirection);
        if (myQna) params.set("myQna", "true");
        else params.delete("myQna");

        params.set("page", "1");

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
        });
    };

    const handleSizeChange = (newSize) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newSize) {
            params.set("size", newSize);
        }
        if (myQna) {
            params.set("myQna", "true");
        } else {
            params.delete("myQna");
        }

        params.set("page", "1");

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="row gy-2 gx-3 align-items-center mb-4 border rounded p-3">
            {/* 내 문의글만 보기 */}
            {isLoggedIn && (<div className="col-12 mt-2">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="myQna"
                        checked={myQna}
                        onChange={(e) => handlemyQnaToggle(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="myQna">
                        나의 문의 내역만 보기
                    </label>
                </div>
            </div>)}


            {/* 날짜 필터 */}
            <div className="col-auto">
                <label htmlFor="startDate" className="col-form-label fw-semibold">등록일</label>
            </div>
            <div className="col-auto">
                <input type="date" id="startDate" name="startDate" className="form-control"
                       value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
            </div>
            <div className="col-auto">~</div>
            <div className="col-auto">
                <input type="date" id="endDate" name="endDate" className="form-control"
                       value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
            </div>

            {/* 키워드 */}
            <div className="col-md">
                <input type="text" id="keyword" name="keyword"
                       value={keyword}
                       onChange={(e) => setKeyword(e.target.value)}
                       placeholder="제목 또는 내용"
                       className="form-control"/>
            </div>

            {/* 버튼 */}
            <SearchButtons url={`/qna/list`}/>

            {/* 하단 정렬 및 페이지 사이즈 */}
            <div className="col-12 d-flex flex-wrap justify-content-between align-items-center mt-3 gap-3">
                {/* 페이지 사이즈 */}
                <div className="d-flex align-items-center gap-2">
                    <select id="size" name="size" className="form-select w-auto"
                            value={size}
                            onChange={(e) => {
                                setSize(e.target.value);
                                handleSizeChange(e.target.value);
                            }}>
                        {[10, 20, 30, 40, 50].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    <span>개씩 보기</span>
                </div>

                {/* 정렬 */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold">정렬</span>
                    <select id="sortBy" name="sortBy" className="form-select w-auto"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                handleSortChange(e.target.value, sortDirection);
                            }}>
                        <option value="CREATE_DATE">등록일시</option>
                        <option value="SUBJECT">제목</option>
                        <option value="VIEW_COUNT">조회수</option>
                    </select>

                    <select id="sortDirection" name="sortDirection" className="form-select w-auto"
                            value={sortDirection}
                            onChange={(e) => {
                                setSortDirection(e.target.value);
                                handleSortChange(sortBy, e.target.value);
                            }}>
                        <option value="DESC">내림차순</option>
                        <option value="ASC">오름차순</option>
                    </select>
                </div>
            </div>
        </form>

    );
};

export default QnaSearchForm;
