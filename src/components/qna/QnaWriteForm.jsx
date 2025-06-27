const QnaWriteForm = ({formData, setFormData}) => {
    return (
        <>
            <tr>
                <th className="ps-3 bg-light fw-semibold">제목 <span className="text-danger">*</span></th>
                <td>
                    <input
                        type="text"
                        name="subject"
                        className="form-control w-100"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
                    />
                </td>
            </tr>

            <tr>
                <th className="ps-3 bg-light fw-semibold">내용 <span className="text-danger">*</span></th>
                <td>
                    <textarea
                        name="content"
                        rows="30"
                        className="form-control w-100"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
                    ></textarea>
                </td>
            </tr>

            <tr>
                <th className="ps-3 bg-light fw-semibold">비밀글</th>
                <td>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="secret"
                            name="secret"
                            checked={formData.secret}
                            onChange={(e) => setFormData(prev => ({...prev, secret: e.target.checked}))}
                        />
                        <label className="form-check-label" htmlFor="secret">
                            비밀글로 설정합니다.
                        </label>
                    </div>
                </td>
            </tr>
        </>
    );
};
export default QnaWriteForm;
