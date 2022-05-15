import { Image } from "@tarojs/components";

import ImgFilePdf from "@/assets/file-type/pdf.svg";

const FILE_IMG = {
  pdf: ImgFilePdf,
};

const FileType = ({ type, ...rest }) => {
  return <Image src={FILE_IMG[type]} {...rest} />;
};

export default FileType;
