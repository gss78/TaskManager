import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  imageUploadContainer: {
    margin: 10,
  },

  previewContainer: {
    margin: 10,
  },

  preview: {
    maxWidth: 300,
    maxHeight: 300,
  },
}));

export default useStyles;
