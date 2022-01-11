import React, { useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import {
  Modal,
  Body,
  InputSizeEnum,
  InputStateEnum,
  StandardInput,
  Select,
  SelectSizeEnum,
  SelectTypeEnum,
} from '..';
import { splitUnits } from '../../store/actions/climateWarehouseActions';

const InputContainer = styled('div')`
  width: 20rem;
`;

const StyledFieldContainer = styled('div')`
  padding-bottom: 2.25rem;
`;

const StyledLabelContainer = styled('div')`
  padding: 0.3rem 0 0.3rem 0;
`;

const StyledContainer = styled('div')`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
`;

const StyledSplitEntry = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
`;

const SplitUnitForm = ({ onClose, organizations, record }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([
    { unitCount: null, unitOwnerOrgUid: null },
    { unitCount: null, unitOwnerOrgUid: null },
  ]);

  const intl = useIntl();

  const organizationsArray = Object.keys(organizations).map(key => ({
    value: key,
    label: organizations[key].name,
  }));

  const validationSchema = yup
    .array()
    .of(
      yup.object().shape({
        unitCount: yup
          .number()
          .required({ unitCount: 'unitCount is required.' })
          .positive()
          .integer(),
        unitOwnerOrgUid: yup.string().nullable(),
      }),
    )
    .test(
      'test array elements sum',
      'unit counts do not add up',
      value => value[0].unitCount + value[1].unitCount === record.unitCount,
    );

  const onSubmit = () => {
    validationSchema
      .validate(data, { abortEarly: false, recursive: true })
      .then(() => {
        dispatch(splitUnits);
      })
      .catch(err => {
        err.errors.forEach(error => console.log(error));
      });
  };

  return (
    <Modal
      onOk={onSubmit}
      onClose={onClose}
      basic
      form
      showButtons
      title={intl.formatMessage({
        id: 'split',
      })}
      body={
        <StyledContainer>
          {data.map((item, index) => (
            <StyledSplitEntry key={index}>
              <StyledFieldContainer>
                <div>
                  <Body size="Bold">
                    <FormattedMessage id="record" /> {index + 1}
                  </Body>
                </div>
                <StyledLabelContainer>
                  <Body color={'#262626'}>
                    <FormattedMessage id="nr-of-units" />
                  </Body>
                </StyledLabelContainer>
                <InputContainer>
                  <StandardInput
                    size={InputSizeEnum.large}
                    state={InputStateEnum.default}
                    value={item.unitCount}
                    onChange={value =>
                      setData(prevData => {
                        const newData = [...prevData];
                        newData[index].unitCount = value;
                        return newData;
                      })
                    }
                  />
                </InputContainer>
              </StyledFieldContainer>
              <StyledFieldContainer>
                <StyledLabelContainer>
                  <Body color={'#262626'}>
                    <FormattedMessage id="units-owner" />
                  </Body>
                </StyledLabelContainer>
                <InputContainer>
                  <Select
                    size={SelectSizeEnum.large}
                    type={SelectTypeEnum.basic}
                    options={organizationsArray}
                    placeholder="Select"
                    onChange={value =>
                      setData(prevData => {
                        const newData = [...prevData];
                        newData[index].unitOwnerOrgUid = value[0].value;
                        return newData;
                      })
                    }
                  />
                </InputContainer>
              </StyledFieldContainer>
            </StyledSplitEntry>
          ))}
        </StyledContainer>
      }
    />
  );
};

export { SplitUnitForm };
