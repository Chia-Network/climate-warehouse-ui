import React, { useMemo, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';

import {
  Modal,
  Body,
  InputSizeEnum,
  InputStateEnum,
  InputVariantEnum,
  ModalFormContainerStyle,
  modalTypeEnum,
  FormContainerStyle,
  BodyContainer,
  LabelContainer,
  ToolTipContainer,
  DescriptionIcon,
  FieldRequired,
  StyledFieldRequired,
  StyledLabelContainer,
  StyledFieldContainer,
  InputContainer,
  SimpleSelectSizeEnum,
  SimpleSelectStateEnum,
  SimpleSelectTypeEnum,
  SimpleSelect,
  FormikError,
} from '..';
import { splitUnitValidationSchema } from '../../store/validations';
import { StandardInput } from '../form/StandardInput';
import { editStagingData } from '../../store/actions/climateWarehouseActions';

const UnitSplitEditStagingFormModal = ({ onClose, changeGroup }) => {
  console.log('changeGroup', changeGroup);

  const { units, pickLists } = useSelector(store => store.climateWarehouse);
  const intl = useIntl();
  const { notification, showProgressOverlay: apiResponseIsPending } =
    useSelector(state => state.app);
  const dispatch = useDispatch();

  const fullRecord = useMemo(
    () =>
      units.filter(
        unit =>
          unit.warehouseUnitId === changeGroup.diff.original.warehouseUnitId,
      )[0],
    [units],
  );

  const isUnitDivisible = useMemo(
    () => parseInt(fullRecord.unitCount) !== 1,
    [fullRecord],
  );

  const getIsUnitSumValid = useCallback(
    (val1, val2) => parseInt(val1) + parseInt(val2) === fullRecord.unitCount,
    [fullRecord],
  );

  // if staging unit split was successfully edited, close modal
  const unitWasSuccessfullySplit =
    notification && notification.id === 'staging-group-edited';
  useEffect(() => {
    if (unitWasSuccessfullySplit) {
      onClose();
    }
  }, [notification]);

  const submitForm = useCallback(
    values => {
      if (
        getIsUnitSumValid(values[0].unitCount, values[1].unitCount) &&
        !apiResponseIsPending
      ) {
        dispatch(editStagingData(changeGroup.uuid, values));
      }
    },
    [getIsUnitSumValid, changeGroup, apiResponseIsPending],
  );

  return (
    <Formik
      validationSchema={splitUnitValidationSchema}
      initialValues={changeGroup.diff.change.map(unitItem => ({
        ...unitItem,
        unitCount: unitItem?.unitCount ?? 0,
        unitOwner: unitItem?.unitOwner ?? '',
        countryJurisdictionOfOwner: unitItem?.countryJurisdictionOfOwner ?? '',
        inCountryJurisdictionOfOwner:
          unitItem?.inCountryJurisdictionOfOwner ?? '',
        unitBlockStart: unitItem?.unitBlockStart ?? '',
        unitBlockEnd: unitItem?.unitBlockEnd ?? '',
      }))}
      onSubmit={submitForm}
    >
      {formik => (
        <Modal
          onOk={formik.submitForm}
          onClose={onClose}
          modalType={modalTypeEnum.basic}
          hideButtons={!isUnitDivisible}
          title={intl.formatMessage({
            id: 'edit-split-unit',
          })}
          label={intl.formatMessage({
            id: 'update',
          })}
          body={
            <ModalFormContainerStyle>
              <Body size="Bold">
                <FormattedMessage id="total-units-available" />:{' '}
                {fullRecord.unitCount}
              </Body>
              <Body size="Small">
                <FormattedMessage id="serial-number-block" />:{' '}
                {fullRecord.serialNumberBlock}
              </Body>
              <FormContainerStyle>
                <StyledFieldContainer></StyledFieldContainer>
                {formik.values.map((unit, index) => (
                  <React.Fragment key={index}>
                    {index === 1 && <StyledFieldRequired />}
                    {index === 0 && <FieldRequired />}
                    <StyledLabelContainer>
                      <Body size="Bold">
                        <FormattedMessage id="record" /> {index + 1}
                      </Body>
                    </StyledLabelContainer>
                    <BodyContainer key={index}>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body>
                            <LabelContainer>
                              * <FormattedMessage id="nr-of-units" />
                            </LabelContainer>
                            <ToolTipContainer
                              tooltip={intl.formatMessage({
                                id: 'unit-count',
                              })}
                            >
                              <DescriptionIcon height="14" width="14" />
                            </ToolTipContainer>
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'nr-of-units',
                            })}
                            state={
                              isUnitDivisible
                                ? InputStateEnum.default
                                : InputStateEnum.disabled
                            }
                            variant={
                              formik?.touched[index]?.unitCount &&
                              formik?.errors[index]?.unitCount
                                ? InputVariantEnum.error
                                : InputVariantEnum.default
                            }
                            name={`[${index}].unitCount`}
                            value={unit.unitCount}
                            onChange={value =>
                              formik.setFieldValue(
                                `[${index}].unitCount`,
                                value,
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </InputContainer>
                        <FormikError name={`[${index}].unitCount`} />
                        {formik?.touched[index]?.unitCount &&
                          !getIsUnitSumValid(
                            formik.values[0].unitCount,
                            formik.values[1].unitCount,
                          ) && (
                            <Body size="Small" color="red">
                              <FormattedMessage id="units-dont-add-up" />
                              {fullRecord.unitCount}
                            </Body>
                          )}
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body>
                            <LabelContainer>
                              <FormattedMessage id="unit-owner" />
                            </LabelContainer>
                            <ToolTipContainer
                              tooltip={intl.formatMessage({
                                id: 'units-unit-owner-description',
                              })}
                            >
                              <DescriptionIcon height="14" width="14" />
                            </ToolTipContainer>
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'unit-owner',
                            })}
                            variant={
                              formik?.touched[index]?.unitOwner &&
                              formik?.errors[index]?.unitOwner
                                ? InputVariantEnum.error
                                : InputVariantEnum.default
                            }
                            state={
                              isUnitDivisible
                                ? InputStateEnum.default
                                : InputStateEnum.disabled
                            }
                            value={unit.unitOwner}
                            name={`[${index}].unitOwner`}
                            onChange={value =>
                              formik.setFieldValue(
                                `[${index}].unitOwner`,
                                value,
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </InputContainer>
                        <FormikError name={`[${index}].unitOwner`} />
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body>
                            <LabelContainer>
                              * <FormattedMessage id="unit-block-start" />
                            </LabelContainer>
                            <ToolTipContainer
                              tooltip={intl.formatMessage({
                                id: 'units-unit-block-start-description',
                              })}
                            >
                              <DescriptionIcon height="14" width="14" />
                            </ToolTipContainer>
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'unit-block-start',
                            })}
                            variant={
                              formik?.touched[index]?.unitBlockStart &&
                              formik?.errors[index]?.unitBlockStart
                                ? InputVariantEnum.error
                                : InputVariantEnum.default
                            }
                            state={
                              isUnitDivisible
                                ? InputStateEnum.default
                                : InputStateEnum.disabled
                            }
                            value={unit.unitBlockStart}
                            name={`[${index}].unitBlockStart`}
                            onChange={value =>
                              formik.setFieldValue(
                                `[${index}].unitBlockStart`,
                                value,
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </InputContainer>
                        <FormikError name={`[${index}].unitBlockStart`} />
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body>
                            <LabelContainer>
                              * <FormattedMessage id="unit-block-end" />
                            </LabelContainer>
                            <ToolTipContainer
                              tooltip={intl.formatMessage({
                                id: 'units-unit-block-end-description',
                              })}
                            >
                              <DescriptionIcon height="14" width="14" />
                            </ToolTipContainer>
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'unit-block-end',
                            })}
                            variant={
                              formik?.touched[index]?.unitBlockEnd &&
                              formik?.errors[index]?.unitBlockEnd
                                ? InputVariantEnum.error
                                : InputVariantEnum.default
                            }
                            state={
                              isUnitDivisible
                                ? InputStateEnum.default
                                : InputStateEnum.disabled
                            }
                            value={unit.unitBlockEnd}
                            name={`[${index}].unitBlockEnd`}
                            onChange={value =>
                              formik.setFieldValue(
                                `[${index}].unitBlockEnd`,
                                value,
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </InputContainer>
                        <FormikError name={`[${index}].unitBlockEnd`} />
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body>
                            <LabelContainer>
                              <FormattedMessage id="country-jurisdiction-of-owner" />
                            </LabelContainer>
                            <ToolTipContainer
                              tooltip={intl.formatMessage({
                                id: 'units-country-jurisdiction-of-owner-description',
                              })}
                            >
                              <DescriptionIcon height="14" width="14" />
                            </ToolTipContainer>
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <SimpleSelect
                            size={SimpleSelectSizeEnum.large}
                            type={SimpleSelectTypeEnum.basic}
                            options={pickLists.countries}
                            state={
                              isUnitDivisible
                                ? SimpleSelectStateEnum.default
                                : SimpleSelectStateEnum.disabled
                            }
                            onChange={selectedOptions =>
                              formik.setFieldValue(
                                `[${index}].countryJurisdictionOfOwner`,
                                selectedOptions[0],
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </InputContainer>
                        <FormikError
                          name={`[${index}].countryJurisdictionOfOwner`}
                        />
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body>
                            <LabelContainer>
                              <FormattedMessage id="in-country-jurisdiction-of-owner" />
                            </LabelContainer>
                            <ToolTipContainer
                              tooltip={intl.formatMessage({
                                id: 'units-in-country-jurisdiction-of-owner-description',
                              })}
                            >
                              <DescriptionIcon height="14" width="14" />
                            </ToolTipContainer>
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'in-country-jurisdiction-of-owner',
                            })}
                            state={
                              isUnitDivisible
                                ? InputStateEnum.default
                                : InputStateEnum.disabled
                            }
                            variant={
                              formik?.touched[index]
                                ?.inCountryJurisdictionOfOwner &&
                              formik?.errors[index]
                                ?.inCountryJurisdictionOfOwner
                                ? InputVariantEnum.error
                                : InputVariantEnum.default
                            }
                            value={unit.inCountryJurisdictionOfOwner}
                            name={`[${index}].inCountryJurisdictionOfOwner`}
                            onChange={value =>
                              formik.setFieldValue(
                                `[${index}].inCountryJurisdictionOfOwner`,
                                value,
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </InputContainer>
                        <FormikError
                          name={`[${index}].inCountryJurisdictionOfOwner`}
                        />
                      </StyledFieldContainer>
                    </BodyContainer>
                  </React.Fragment>
                ))}
              </FormContainerStyle>
            </ModalFormContainerStyle>
          }
        />
      )}
    </Formik>
  );
};

export { UnitSplitEditStagingFormModal };
