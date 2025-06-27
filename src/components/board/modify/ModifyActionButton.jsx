const ModifyActionButton = ({onSubmit}) => {
    return (
        <div className="d-flex justify-content-end mt-3">
            <button type="button" className="btn btn-secondary me-2" onClick={() => window.history.back()}>
                취소
            </button>
            <button type="button" className="btn btn-primary" onClick={onSubmit}>
                저장
            </button>
        </div>
    );
};

export default ModifyActionButton;
