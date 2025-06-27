import {downloadFile} from "@/api/fileApi";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const PostFile = ({files}) => {
    return (
        <div className="mt-4">
            <h6>첨부파일</h6>
            <ul className="list-unstyled mb-0" id="fileList">
                {files.map((f) => (
                    <li key={f.savedFilename}>
                        <FileDownloadIcon/>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            downloadFile(f.savedFilename);
                        }} title={`${f.originalFilename} 다운로드`}>
                            {f.originalFilename}
                        </a>
                    </li>))
                }
            </ul>
        </div>
    );
}

export default PostFile;
