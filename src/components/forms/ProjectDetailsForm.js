import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';

import {
  StandardInput,
  InputSizeEnum,
  InputStateEnum,
  InputVariantEnum,
  ModalFormContainerStyle,
  FormContainerStyle,
  BodyContainer,
  Body,
  DateSelect,
  DateSelectVariantEnum,
  DescriptionIcon,
  ToolTipContainer,
  LabelContainer,
  FieldRequired,
  SimpleSelectSizeEnum,
  SimpleSelectTypeEnum,
  SimpleSelectStateEnum,
  SimpleSelectVariantEnum,
  InputContainer,
  StyledFieldContainer,
  StyledLabelContainer,
  SimpleSelect,
  SpanTwoColumnsContainer,
  HrSpanTwoColumnsContainer,
  RequiredContainer,
  Textarea,
  TextareaSizeEnum,
  TextareaStateEnum,
  FormikError,
  SelectCreatable,
} from '..';

const ProjectDetailsForm = () => {
  const intl = useIntl();
  const { pickLists } = useSelector(store => store.climateWarehouse);
  const { values, setFieldValue, handleBlur, errors, touched } =
    useFormikContext();

  return (
    <ModalFormContainerStyle>
      <RequiredContainer>
        <FieldRequired />
      </RequiredContainer>
      <FormContainerStyle>
        <BodyContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="project-name" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-project-name-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={
                  errors.projectName && touched.projectName
                    ? InputVariantEnum.error
                    : undefined
                }
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'project-name',
                })}
                state={InputStateEnum.default}
                value={values.projectName}
                onChange={value => setFieldValue('projectName', value)}
                onBlur={handleBlur}
                name="projectName"
              />
            </InputContainer>
            <FormikError name="projectName" />
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="project-id" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-project-id-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <StandardInput
              variant={
                errors.projectId && touched.projectId
                  ? InputVariantEnum.error
                  : undefined
              }
              size={InputSizeEnum.large}
              placeholderText={intl.formatMessage({
                id: 'project-id',
              })}
              state={InputStateEnum.default}
              value={values.projectId}
              onChange={value => setFieldValue('projectId', value)}
              onBlur={handleBlur}
              name="projectId"
            />
            <FormikError name="projectId" />
          </StyledFieldContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    <FormattedMessage id="project-description" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'projects-description-description',
                    })}>
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>
              <Textarea
                size={TextareaSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'project-description',
                })}
                value={values.description}
                state={TextareaStateEnum.default}
                onChange={event =>
                  setFieldValue('description', event.target.value)
                }
                onBlur={handleBlur}
                name="description"
              />
              <FormikError name="description" />
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="project-developer" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-project-developer-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={
                  errors.projectDeveloper && touched.projectDeveloper
                    ? InputVariantEnum.error
                    : undefined
                }
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'project-developer',
                })}
                state={InputStateEnum.default}
                value={values.projectDeveloper}
                onChange={value => setFieldValue('projectDeveloper', value)}
                onBlur={handleBlur}
                name="projectDeveloper"
              />
            </InputContainer>
            <FormikError name="projectDeveloper" />
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="program" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-program-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'program',
                })}
                state={InputStateEnum.default}
                value={values.program}
                onChange={value => setFieldValue('program', value)}
                onBlur={handleBlur}
                name="program"
              />
            </InputContainer>
            <FormikError name="program" />
          </StyledFieldContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    *<FormattedMessage id="project-link" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'projects-project-link-description',
                    })}>
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>
              <StandardInput
                variant={
                  errors.projectLink && touched.projectLink
                    ? InputVariantEnum.error
                    : undefined
                }
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'project-link',
                })}
                state={InputStateEnum.default}
                value={values.projectLink}
                onChange={value => setFieldValue('projectLink', value)}
                onBlur={handleBlur}
                name="projectLink"
              />
              <FormikError name="projectLink" />
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="sector" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-sector-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <SimpleSelect
                variant={
                  errors.sector &&
                  touched.sector &&
                  SimpleSelectVariantEnum.error
                }
                size={SimpleSelectSizeEnum.large}
                type={SimpleSelectTypeEnum.basic}
                options={pickLists.projectSector}
                state={SimpleSelectStateEnum.default}
                selected={values.sector ? [values.sector] : undefined}
                onChange={selectedOptions =>
                  setFieldValue('sector', selectedOptions[0])
                }
                onBlur={handleBlur}
              />
            </InputContainer>
            <FormikError name="sector" />
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="project-type" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-project-type-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <SimpleSelect
              variant={
                errors.projectType &&
                touched.projectType &&
                SimpleSelectVariantEnum.error
              }
              size={SimpleSelectSizeEnum.large}
              type={SimpleSelectTypeEnum.basic}
              options={pickLists.projectType}
              state={SimpleSelectStateEnum.default}
              selected={values.projectType ? [values.projectType] : undefined}
              onChange={selectedOptions =>
                setFieldValue('projectType', selectedOptions[0])
              }
              onBlur={handleBlur}
            />
            <FormikError name="projectType" />
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="project-status" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-project-status-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <SimpleSelect
                variant={
                  errors.projectStatus &&
                  touched.projectStatus &&
                  SimpleSelectVariantEnum.error
                }
                size={SimpleSelectSizeEnum.large}
                type={SimpleSelectTypeEnum.basic}
                options={pickLists.projectStatusValues}
                state={SimpleSelectStateEnum.default}
                selected={
                  values.projectStatus ? [values.projectStatus] : undefined
                }
                onChange={selectedOptions =>
                  setFieldValue('projectStatus', selectedOptions[0])
                }
                onBlur={handleBlur}
              />
              <FormikError name="projectStatus" />
            </InputContainer>
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="project-status-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-project-status-date-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                variant={
                  errors.projectStatusDate &&
                  touched.projectStatusDate &&
                  DateSelectVariantEnum.error
                }
                size="large"
                dateValue={values.projectStatusDate}
                setDateValue={value =>
                  setFieldValue('projectStatusDate', value)
                }
                name={'projectStatusDate'}
                onBlur={handleBlur}
              />
              <FormikError name="projectStatusDate" />
            </InputContainer>
          </StyledFieldContainer>
          <HrSpanTwoColumnsContainer>
            <hr />
          </HrSpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="covered-by-ndc" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-covered-by-ndc-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <SimpleSelect
                variant={
                  errors.coveredByNDC &&
                  touched.coveredByNDC &&
                  SimpleSelectVariantEnum.error
                }
                size={SimpleSelectSizeEnum.large}
                type={SimpleSelectTypeEnum.basic}
                options={pickLists.coveredByNDC}
                state={SimpleSelectStateEnum.default}
                selected={
                  values.coveredByNDC ? [values.coveredByNDC] : undefined
                }
                onChange={selectedOptions =>
                  setFieldValue('coveredByNDC', selectedOptions[0])
                }
                onBlur={handleBlur}
              />
            </InputContainer>
            <FormikError name="coveredByNDC" />
          </StyledFieldContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    <FormattedMessage id="ndc-information" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'projects-ndc-information-description',
                    })}>
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>

              <StandardInput
                variant={
                  errors.ndcInformation && touched.ndcInformation
                    ? InputVariantEnum.error
                    : undefined
                }
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'ndc-information',
                })}
                state={InputStateEnum.default}
                value={values.ndcInformation}
                onChange={value => setFieldValue('ndcInformation', value)}
                onBlur={handleBlur}
                name="ndcInformation"
              />
              <FormikError name="ndcInformation" />
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    *<FormattedMessage id="current-registry" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'projects-current-registry-description',
                    })}>
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>
              <InputContainer>
                {pickLists?.registries ? (
                  <SelectCreatable
                    variant={
                      errors.currentRegistry &&
                      touched.currentRegistry &&
                      SimpleSelectVariantEnum.error
                    }
                    options={pickLists.registries}
                    onChange={val => setFieldValue('currentRegistry', val)}
                  />
                ) : (
                  <StandardInput
                    variant={
                      errors.currentRegistry && touched.currentRegistry
                        ? InputVariantEnum.error
                        : undefined
                    }
                    size={InputSizeEnum.large}
                    placeholderText={intl.formatMessage({
                      id: 'current-registry',
                    })}
                    state={InputStateEnum.default}
                    value={values.currentRegistry}
                    onChange={value => setFieldValue('currentRegistry', value)}
                    onBlur={handleBlur}
                    name="currentRegistry"
                  />
                )}
              </InputContainer>
              <FormikError name="currentRegistry" />
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="registry-of-origin" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-registry-of-origin-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              {pickLists?.registries ? (
                <SelectCreatable
                  variant={
                    errors.registryOfOrigin &&
                    touched.registryOfOrigin &&
                    SimpleSelectVariantEnum.error
                  }
                  options={pickLists.registries}
                  onChange={val => setFieldValue('registryOfOrigin', val)}
                />
              ) : (
                <StandardInput
                  variant={
                    errors.registryOfOrigin && touched.registryOfOrigin
                      ? InputVariantEnum.error
                      : undefined
                  }
                  size={InputSizeEnum.large}
                  placeholderText={intl.formatMessage({
                    id: 'registry-of-origin',
                  })}
                  state={InputStateEnum.default}
                  value={values.registryOfOrigin}
                  onChange={value => setFieldValue('registryOfOrigin', value)}
                  onBlur={handleBlur}
                  name="registryOfOrigin"
                />
              )}
            </InputContainer>
            <FormikError name="registryOfOrigin" />
          </StyledFieldContainer>

          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="origin-project-id" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-origin-project-id-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={
                  errors.originProjectId && touched.originProjectId
                    ? InputVariantEnum.error
                    : undefined
                }
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'origin-project-id',
                })}
                state={InputStateEnum.default}
                value={values.originProjectId}
                onChange={value => setFieldValue('originProjectId', value)}
                onBlur={handleBlur}
                name="originProjectId"
              />
            </InputContainer>
            <FormikError name="originProjectId" />
          </StyledFieldContainer>
          <HrSpanTwoColumnsContainer>
            <hr />
          </HrSpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  *<FormattedMessage id="unit-metric" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-unit-metric-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <SimpleSelect
                variant={
                  errors.unitMetric &&
                  touched.unitMetric &&
                  SimpleSelectVariantEnum.error
                }
                size={SimpleSelectSizeEnum.large}
                type={SimpleSelectTypeEnum.basic}
                options={pickLists.unitMetric}
                state={SimpleSelectStateEnum.default}
                selected={
                  values.unitMetric
                    ? [values.unitMetric]
                    : [pickLists.unitMetric[0]]
                }
                onChange={selectedOptions =>
                  setFieldValue('unitMetric', selectedOptions[0])
                }
                onBlur={handleBlur}
              />
              <FormikError name="unitMetric" />
            </InputContainer>
          </StyledFieldContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    *<FormattedMessage id="methodology" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'projects-methodology-description',
                    })}>
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>
              {pickLists?.methodology ? (
                <SelectCreatable
                  variant={
                    errors.methodology &&
                    touched.methodology &&
                    SimpleSelectVariantEnum.error
                  }
                  options={pickLists.methodology}
                  onChange={val => setFieldValue('methodology', val)}
                />
              ) : (
                <StandardInput
                  variant={
                    errors.methodology && touched.methodology
                      ? InputVariantEnum.error
                      : undefined
                  }
                  size={InputSizeEnum.large}
                  placeholderText={intl.formatMessage({
                    id: 'methodology',
                  })}
                  state={InputStateEnum.default}
                  value={values.methodology}
                  onChange={value => setFieldValue('methodology', value)}
                  onBlur={handleBlur}
                  name="methodology"
                />
              )}
              <FormikError name="methodology" />
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="validation-body" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-validation-body-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <SimpleSelect
                size={SimpleSelectSizeEnum.large}
                type={SimpleSelectTypeEnum.basic}
                options={pickLists.validationBody}
                state={SimpleSelectStateEnum.default}
                selected={
                  values.validationBody ? [values.validationBody] : undefined
                }
                onChange={selectedOptions =>
                  setFieldValue('validationBody', selectedOptions[0])
                }
                onBlur={handleBlur}
              />
              <FormikError name="validationBody" />
            </InputContainer>
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="validation-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'projects-validation-date-description',
                  })}>
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                variant={
                  errors.validationDate &&
                  touched.validationDate &&
                  DateSelectVariantEnum.error
                }
                size="large"
                dateValue={values.validationDate}
                setDateValue={value => setFieldValue('validationDate', value)}
                name="validationDate"
                onBlur={handleBlur}
              />
              <FormikError name="validationDate" />
            </InputContainer>
          </StyledFieldContainer>
          <HrSpanTwoColumnsContainer>
            <hr />
          </HrSpanTwoColumnsContainer>
          <SpanTwoColumnsContainer>
            <StyledFieldContainer>
              <StyledLabelContainer>
                <Body>
                  <LabelContainer>
                    <FormattedMessage id="project-tags" />
                  </LabelContainer>
                  <ToolTipContainer
                    tooltip={intl.formatMessage({
                      id: 'projects-project-tags-description',
                    })}>
                    <DescriptionIcon height="14" width="14" />
                  </ToolTipContainer>
                </Body>
              </StyledLabelContainer>

              <StandardInput
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'project-tags',
                })}
                state={InputStateEnum.default}
                value={values.projectTags}
                onChange={value => setFieldValue('projectTags', value)}
                onBlur={handleBlur}
                name="projectTags"
              />
              <FormikError name="projectTags" />
            </StyledFieldContainer>
          </SpanTwoColumnsContainer>
        </BodyContainer>
      </FormContainerStyle>
    </ModalFormContainerStyle>
  );
};

export { ProjectDetailsForm };
