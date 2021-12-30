import u from 'updeep';
import React from 'react';
import styled from 'styled-components';

import { StandardInput, InputSizeEnum, InputStateEnum, Divider } from '..';
import { Body } from '../typography';

const StyledLabelContainer = styled('div')`
  margin-bottom: 0.5rem;
`;

const StyledFieldContainer = styled('div')`
  padding-bottom: 20px;
`;

const InputContainer = styled('div')`
  width: 320px;
`;

const ModalFormContainerStyle = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const FormContainerStyle = styled('div')`
  display: flex;
  justify-content: flex-start;
  width: 90%;
`;

const BodyContainer = styled('div')`
  display: flex;
  flex-direction: column;
  padding-right: 4.125rem;
`;

const CreateRelatedProjectsForm = ({ value, onChange }) => {
  const onInputChange = (field, changeValue) => {
    onChange(u({ [field]: changeValue }, value));
  };

  return (
    <ModalFormContainerStyle>
      <FormContainerStyle>
        <BodyContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body color={'#262626'}>Related Project ID</Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                size={InputSizeEnum.large}
                placeholderText="Related Project ID"
                state={InputStateEnum.default}
                value={value.projectId}
                onChange={changeValue =>
                  onInputChange('projectId', changeValue)
                }
              />
            </InputContainer>
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body color={'#262626'}>Related Project Type</Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                size={InputSizeEnum.large}
                placeholderText="Related Project Type"
                state={InputStateEnum.default}
                value={value.type}
                onChange={changeValue =>
                  onInputChange('type', changeValue)
                }
              />
            </InputContainer>
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body color={'#262626'}>Registry</Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                size={InputSizeEnum.large}
                placeholderText="Registry"
                state={InputStateEnum.default}
                value={value.registry}
                onChange={changeValue =>
                  onInputChange('registry', changeValue)
                }
              />
            </InputContainer>
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body color={'#262626'}>Related Project Note</Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                size={InputSizeEnum.large}
                placeholderText="Related Project Note"
                state={InputStateEnum.default}
                value={value.note}
                onChange={changeValue =>
                  onInputChange('note', changeValue)
                }
              />
            </InputContainer>
          </StyledFieldContainer>
        </BodyContainer>
      </FormContainerStyle>
      <Divider />
    </ModalFormContainerStyle>
  );
};

export { CreateRelatedProjectsForm };