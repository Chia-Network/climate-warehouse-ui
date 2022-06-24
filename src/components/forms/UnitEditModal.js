import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useIntl } from 'react-intl';

import { Modal, TabPanel, modalTypeEnum, UnitDetailsFormik } from '..';
import UnitLabelsRepeater from './UnitLabelsRepeater';
import { unitsSchema } from '../../store/validations';
import { setValidateForm, setForm } from '../../store/actions/app';
import {
  getIssuances,
  getPaginatedData,
  updateUnitsRecord,
  getMyProjects,
} from '../../store/actions/climateWarehouseActions';
import {
  cleanObjectFromEmptyFieldsOrArrays,
  formatAPIData,
} from '../../utils/formatData';

const StyledFormContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
`;

const UnitEditModal = ({ onClose, record, modalSizeAndPosition }) => {
  const { myOrgUid } = useSelector(store => store.climateWarehouse);
  const { notification, showProgressOverlay: apiResponseIsPending } =
    useSelector(state => state.app);
  const [unit, setUnit] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const intl = useIntl();

  const unitToBeEdited = useSelector(
    state =>
      state.climateWarehouse.units.filter(
        unit => unit.warehouseUnitId === record.warehouseUnitId,
      )[0],
  );

  useEffect(() => {
    if (myOrgUid) {
      dispatch(getMyProjects(myOrgUid));
      dispatch(getPaginatedData({ type: 'projects', orgUid: myOrgUid }));
      dispatch(getIssuances());
      localStorage.removeItem('unitSelectedWarehouseProjectId');
    }
  }, []);

  useEffect(() => {
    const formattedUnitToBeEdited = formatAPIData(unitToBeEdited);
    setUnit(formattedUnitToBeEdited);
  }, [unitToBeEdited]);

  useEffect(() => {
    dispatch(setForm(stepperStepsTranslationIds[tabValue]));
  }, [tabValue]);

  const stepperStepsTranslationIds = ['unit', 'issuance', 'labels'];

  const onChangeStep = async (desiredStep = null) => {
    const isUnitValid = await unitsSchema.isValid(unit);
    const isMandatoryIssuanceChecked =
      desiredStep > 1 ? Object.keys(unit.issuance)?.length > 0 : true;
    const isProjectSelectedAtFirstStep = Boolean(
      localStorage.getItem('unitSelectedWarehouseProjectId'),
    );

    dispatch(setValidateForm(true));
    if (
      isUnitValid &&
      isProjectSelectedAtFirstStep &&
      isMandatoryIssuanceChecked
    ) {
      dispatch(setValidateForm(false));
      if (
        desiredStep >= stepperStepsTranslationIds.length &&
        !apiResponseIsPending
      ) {
        handleUpdateUnit();
      } else {
        dispatch(setValidateForm(false));
        setTabValue(desiredStep);
      }
    }
  };

  const handleUpdateUnit = async () => {
    const dataToSend = _.cloneDeep(unit);
    if (dataToSend.serialNumberBlock) {
      delete dataToSend.serialNumberBlock;
    }
    cleanObjectFromEmptyFieldsOrArrays(dataToSend);
    dispatch(updateUnitsRecord(dataToSend));
  };

  const unitWasSuccessfullyEdited =
    notification?.id === 'unit-successfully-edited';
  useEffect(() => {
    if (unitWasSuccessfullyEdited) {
      onClose();
    }
  }, [notification]);

  return (
    <>
      <Modal
        modalSizeAndPosition={modalSizeAndPosition}
        onOk={() => onChangeStep(tabValue + 1)}
        onClose={onClose}
        modalType={modalTypeEnum.basic}
        title={intl.formatMessage({
          id: 'edit-unit',
        })}
        label={intl.formatMessage({
          id: tabValue < 2 ? 'next' : 'update-unit',
        })}
        extraButtonLabel={
          tabValue > 0
            ? intl.formatMessage({
                id: 'back',
              })
            : undefined
        }
        extraButtonOnClick={() =>
          onChangeStep(tabValue > 0 ? tabValue - 1 : tabValue)
        }
        body={
          <StyledFormContainer>
            <Stepper activeStep={tabValue} alternativeLabel>
              {stepperStepsTranslationIds &&
                stepperStepsTranslationIds.map((step, index) => (
                  <Step
                    key={index}
                    onClick={() => onChangeStep(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StepLabel>
                      {intl.formatMessage({
                        id: step,
                      })}
                    </StepLabel>
                  </Step>
                ))}
            </Stepper>
            <TabPanel
              style={{ paddingTop: '1.25rem' }}
              value={tabValue}
              index={0}
            >
              <UnitDetailsFormik unitDetails={unit} setUnitDetails={setUnit} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {/* <UnitIssuanceRepeater
                max={1}
                issuanceState={unit.issuance !== '' ? [unit.issuance] : []}
                newIssuanceState={value =>
                  setUnit(prev => ({
                    ...prev,
                    issuance: value[0] ? value[0] : '',
                  }))
                }
              /> */}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <UnitLabelsRepeater
                useToolTip={intl.formatMessage({
                  id: 'labels-units-optional',
                })}
                labelsState={unit.labels}
                newLabelsState={value =>
                  setUnit(prev => ({
                    ...prev,
                    labels: value,
                  }))
                }
              />
            </TabPanel>
          </StyledFormContainer>
        }
      />
    </>
  );
};

export { UnitEditModal };