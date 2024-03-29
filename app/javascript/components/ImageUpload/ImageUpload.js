import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isNil, path } from 'ramda';
import ReactCrop from 'react-image-crop';
import Button from '@material-ui/core/Button';
import useStyles from './useStyles';
import 'react-image-crop/dist/ReactCrop.css';
import { decamelize } from 'utils/keysConverter';

const DEFAULT_CROP_PARAMS = {
  x: 10,
  y: 10,
  width: 200,
  height: 200,
};

const ImageUpload = ({ onUpload }) => {
  const styles = useStyles();

  const [fileAsBase64, changeFileAsBase64] = useState(null);
  const [cropParams, changeCropParams] = useState(DEFAULT_CROP_PARAMS);
  const [file, changeFile] = useState(null);
  const [image, changeImage] = useState(null);

  const handleCropComplete = (newCrop, newPercentageCrop) => {
    changeCropParams(newPercentageCrop);
  };

  const getActualCropParameters = (width, height, params) => ({
    cropX: (params.x * width) / 100,
    cropY: (params.y * height) / 100,
    cropWidth: (params.width * width) / 100,
    cropHeight: (params.height * height) / 100,
  });

  const onImageLoaded = (loadedImage) => {
    changeImage(loadedImage);
  };

  const handleCropChange = (_, newCropParams) => {
    changeCropParams(newCropParams);
  };

  const handleSave = () => {
    const { naturalWidth: width, naturalHeight: height } = image;
    const actualCropParams = getActualCropParameters(width, height, cropParams);
    onUpload({ attachment: { ...decamelize(actualCropParams), image: file } });
  };

  const handleImageRead = (newImage) => changeFileAsBase64(path(['target', 'result'], newImage));

  const handleLoadFile = (e) => {
    e.preventDefault();

    const [acceptedFile] = e.target.files;

    const fileReader = new FileReader();
    fileReader.onload = handleImageRead;
    fileReader.readAsDataURL(acceptedFile);
    changeFile(acceptedFile);
  };

  return fileAsBase64 ? (
    <>
      <div className={styles.crop}>
        <ReactCrop
          src={fileAsBase64}
          crop={cropParams}
          onImageLoaded={onImageLoaded}
          onComplete={handleCropComplete}
          onChange={handleCropChange}
          keepSelection
        />
      </div>
      <Button variant="contained" size="small" color="primary" disabled={isNil(image)} onClick={handleSave}>
        Save
      </Button>
    </>
  ) : (
    <label htmlFor="imageUpload">
      <Button variant="contained" size="small" color="primary" component="span">
        Add Image
      </Button>
      <input accept="image/*" id="imageUpload" type="file" onChange={handleLoadFile} hidden />
    </label>
  );
};

ImageUpload.defaultProps = {
  onUpload: () => {},
};

ImageUpload.propTypes = {
  onUpload: PropTypes.func,
};

export default ImageUpload;
