import { useEffect, useState } from "react";
import { fetchCategories } from "@/api/categoryApi";

const CommonModifyForm = ({ board, formData, setFormData }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!board?.boardId) return;
        fetchCategories(board.boardId)
            .then(setCategories)
            .catch(() => alert("카테고리 정보를 불러오지 못했습니다."));
    }, [board?.boardId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <tr>
                <th className="ps-3 bg-light fw-semibold w-20">
                    카테고리 <span className="text-danger">*</span>
                </th>
                <td>
                    <select
                        name="categoryId"
                        className="form-select w-100"
                        value={formData.categoryId || ""}
                        onChange={handleChange}
                    >
                        <option value="">카테고리 선택</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </td>
            </tr>

            <tr>
                <th className="ps-3 bg-light fw-semibold">제목 <span className="text-danger">*</span></th>
                <td>
                    <input
                        type="text"
                        name="subject"
                        className="form-control w-100"
                        value={formData.subject || ""}
                        onChange={handleChange}
                    />
                </td>
            </tr>

            <tr>
                <th className="ps-3 bg-light fw-semibold">내용 <span className="text-danger">*</span></th>
                <td>
                    <textarea
                        name="content"
                        rows="8"
                        className="form-control w-100"
                        value={formData.content || ""}
                        onChange={handleChange}
                    ></textarea>
                </td>
            </tr>
        </>
    );
};

export default CommonModifyForm;
