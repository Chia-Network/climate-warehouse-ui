import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import {
  Modal,
  modalTypeEnum,
  StyledFieldContainer,
  InputContainer,
  TextareaStateEnum,
  TextareaSizeEnum,
  Textarea,
} from '../../components';

import { commitStagingData } from '../../store/actions/climateWarehouseActions';

const CommitModal = ({ onClose, modalFor }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [commitMessage, setCommitMessage] = useState('');
  const [commitAuthor, setCommitAuthor] = useState('');

  const onCommit = () => {
    if (modalFor === 'projects') {
      dispatch(commitStagingData('Projects', commitMessage));
    } else {
      dispatch(commitStagingData('Units', commitMessage));
    }
    onClose();
  };

  const onCommitAll = () => {
    dispatch(commitStagingData('all', commitMessage, commitAuthor));
    onClose();
  };

  return (
    <Modal
      title={intl.formatMessage({
        id:
          modalFor === 'projects'
            ? 'commit-projects-message-question'
            : 'commit-units-message-question',
      })}
      body={
        <div>
          <StyledFieldContainer>
            <InputContainer>
              <Textarea
                size={TextareaSizeEnum.large}
                placeholder={intl.formatMessage({
                  id: 'commit-message',
                })}
                state={TextareaStateEnum.default}
                value={commitMessage}
                onChange={event => setCommitMessage(event.target.value)}
              />
            </InputContainer>
          </StyledFieldContainer>
          <StyledFieldContainer>
            <InputContainer>
              <Textarea
                size={TextareaSizeEnum.large}
                placeholder={intl.formatMessage({
                  id: 'author',
                })}
                state={TextareaStateEnum.default}
                value={commitAuthor}
                onChange={event => setCommitAuthor(event.target.value)}
              />
            </InputContainer>
          </StyledFieldContainer>
        </div>
      }
      modalType={modalTypeEnum.basic}
      extraButtonLabel={intl.formatMessage({ id: 'everything' })}
      extraButtonOnClick={onCommitAll}
      onClose={() => onClose()}
      onOk={onCommit}
      label={intl.formatMessage({
        id: modalFor === 'projects' ? 'only-projects' : 'only-units',
      })}
    />
  );
};

export { CommitModal };
