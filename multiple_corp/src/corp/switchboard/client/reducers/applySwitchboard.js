import * as ApplyActionTypes from 'constants/ApplyActionTypes';

const initialState = {
  // 0 未审核，1 第一步通过， 2 第一步不通过，3第二步通过，4 第二步不通过
  isFirst: 1, //是否是第一次申请
  applyStatus: 0,
  applyEdit: false,
  applyCount: 0,
  applyFailCause: '',
  isMaterialMailed: false,
  resultModalVisible: false,
  applyNumbers: [],
  totalApplyNumbers: '',
  acceptanceType: 0,
  originalImageUrl: '',
  imageViewerVisible: false,
  submitModalVisible: false,
  canSubmitFirst: false,
  canSubmitSecond: false,
  acceptCode: -1,
  license: {
    uploadText: '点击上传',
    // 显示使用
    uploadedFilePath: '',
    // post 使用的 xx_path 参数
    filePath: '',
    // 文件原名
    originFilename: '',
    showUploadedFile: '',
    isImage: false,
    isUploading: false,
    isUploaded: false,
    // 文件格式
    fileType: '',
  },
  legalPhoto: {
    uploadText: '点击上传',
    uploadedFilePath: '',
    filePath: '',
    originFilename: '',
    showUploadedFile: '',
    isImage: false,
    isUploading: false,
    isUploaded: false,
    fileType: '',
  },
  handlePhoto: {
    uploadText: '点击上传',
    uploadedFilePath: '',
    filePath: '',
    originFilename: '',
    showUploadedFile: '',
    isImage: false,
    isUploading: false,
    isUploaded: false,
    fileType: '',
  },
  registerForm: {
    uploadText: '点击上传',
    uploadedFilePath: '',
    filePath: '',
    originFilename: '',
    showUploadedFile: '',
    isImage: false,
    isUploading: false,
    isUploaded: false,
    fileType: '',
  },
  promiseForm: {
    uploadText: '点击上传',
    uploadedFilePath: '',
    filePath: '',
    originFilename: '',
    showUploadedFile: '',
    isImage: false,
    isUploading: false,
    isUploaded: false,
    fileType: '',
  },
  acceptanceForm: {
    uploadText: '点击上传',
    uploadedFilePath: '',
    filePath: '',
    originFilename: '',
    showUploadedFile: '',
    isImage: false,
    isUploading: false,
    isUploaded: false,
    fileType: '',
  },
};

function applySwitchboard(state = initialState, action) {
  switch (action.type) {
    case ApplyActionTypes.GET_UPLOAD_SIGNATURE_SUCCESS:
      {
        const {
          key,
          data
        } = action.payload;
        return {
          ...state,
          [key]: {
            ...state[action.payload.key],
            ...data,
          },
        };
      }
    case ApplyActionTypes.BEFORE_OSS_UPLOAD:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          uploadText: '正在上传...',
          isUploading: true,
          isUploaded: false,
        },
        canSubmitFirst: false,
        canSubmitSecond: false,
      };
    case ApplyActionTypes.AFTER_OSS_UPLOAD:
      {
        const {
          applyCount,
          license,
          legalPhoto,
          handlePhoto,
          registerForm,
          promiseForm,
          acceptanceForm,
          isMaterialMailed,
        } = state;
        return {
          ...state,
          [action.payload.key]: {
            ...state[action.payload.key],
            uploadText: '点击上传',
            isUploading: false,
            isUploaded: true,
          },
          canSubmitFirst: !!license.filePath &&
            !!legalPhoto.filePath &&
            !!handlePhoto.filePath &&
            !!registerForm.filePath &&
            (applyCount-0) > 0,
          canSubmitSecond: !!promiseForm.filePath && !!acceptanceForm.filePath && isMaterialMailed,
        };
      }
    case ApplyActionTypes.UPDATE_APPLY_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    case ApplyActionTypes.TOGGLE_MAILED:
      {
        const {
          promiseForm,
          acceptanceForm,
        } = state;
        return {
          ...state,
          isMaterialMailed: action.payload,
          canSubmitSecond: !!promiseForm.filePath && !!acceptanceForm.filePath && action.payload,
        };
      }
    case ApplyActionTypes.UPDATE_UPLOAD_FIELD:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          ...action.payload.data,
        },
      };
    case ApplyActionTypes.UPDATE_UPLOAD_FIELDS:
      {
        const copyState = Object.assign(state);
        const keys = Object.keys(action.payload);
        keys.forEach((key) => {
          copyState[key] = {
            ...copyState[key],
            ...action.payload[key],
          };
        });
        return {
          ...state,
          ...copyState,
        };
      }
    case ApplyActionTypes.GET_APPLY_NUMBERS_SUCCESS:
      {
        let type = 0;
        const {
          extra
        } = action.payload;
        if (extra) {
          if (Number(extra.code) === 1) {
            type = 1;
          } else if (Number(extra.code) === 2) {
            type = 2;
          }
        }

        return {
          ...state,
          applyNumbers: action.payload.data || [],
          totalApplyNumbers: action.payload.page.total,
          acceptanceType: type,
        };
      }
    case ApplyActionTypes.TOGGLE_RESULT_MODAL_VISIBLE:
      return {
        ...state,
        resultModalVisible: action.payload,
      };
    case ApplyActionTypes.SET_ORIGINAL_IMAGE_URL:
      return {
        ...state,
        originalImageUrl: action.payload,
      };
    case ApplyActionTypes.TOGGLE_FULL_IMAGE_VIEWER:
      return {
        ...state,
        imageViewerVisible: action.payload,
      };
    case ApplyActionTypes.TOGGLE_SUBMIT_MODAL_VISIBLE:
      return {
        ...state,
        submitModalVisible: action.payload,
      };
    case ApplyActionTypes.SET_APPLY_COUNT:
      const {
            isFirst,
            license,
            legalPhoto,
            handlePhoto,
            registerForm,
            promiseForm,
            acceptanceForm,
            isMaterialMailed,
          } = state;
      let canSubmit;
      if (isFirst && license.filePath &&
          !!legalPhoto.filePath &&
          !!handlePhoto.filePath &&
          !!registerForm.filePath &&
          (action.payload-0) > 0) {
          canSubmit = true;
      } else if (!isFirst && (action.payload-0) > 0) {
          canSubmit = true;
      } else {
          canSubmit = false;
      }
      return {
        ...state,
        canSubmitFirst: canSubmit,
        applyCount: action.payload,
      };
    default:
      return state;
  }
}

export default applySwitchboard;