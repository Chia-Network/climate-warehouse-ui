import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useIntl } from 'react-intl';
import { Formik, setNestedObjectValues } from 'formik';

import {
  TabPanel,
  Modal,
  modalTypeEnum,
  ProjectDetailsForm,
  StyledFormContainer,
  FormikRepeater,
  ProjectIssuanceForm,
  ProjectLocationForm,
} from '..';
import { postNewProject } from '../../store/actions/climateWarehouseActions';
import { projectSchema } from '../../store/validations';
import { cleanObjectFromEmptyFieldsOrArrays } from '../../utils/formatData';

const emptyLocation = {
  country: '',
  inCountryRegion: '',
  geographicIdentifier: '',
};

const emptyProject = {
  currentRegistry: '',
  registryOfOrigin: '',
  originProjectId: '',
  program: '',
  projectId: '',
  projectName: '',
  projectLink: '',
  projectDeveloper: '',
  description: '',
  sector: '',
  projectType: '',
  coveredByNDC: '',
  ndcInformation: '',
  projectStatus: '',
  unitMetric: '',
  methodology: '',
  projectTags: '',
  validationBody: '',
  projectStatusDate: null,
  validationDate: null,
};

const emptyIssuance = {
  startDate: '',
  endDate: '',
  verificationApproach: '',
  verificationReportDate: '',
  verificationBody: '',
};

const ProjectCreateModal = ({ onClose, modalSizeAndPosition }) => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const intl = useIntl();
  const { notification, showProgressOverlay: apiResponseIsPending } =
    useSelector(state => state.app);

  // const [project, setProject] = useState(emptyProject);

  const stepperStepsTranslationIds = [
    'project',
    'issuances',
    'project-locations',
    'estimations',
    'labels',
    'ratings',
    'co-benefits',
    'related-projects',
  ];

  const onChangeStepTo = async ({ formik, desiredStep = null }) => {
    const errors = await formik.validateForm();

    // manually setting touched for error fields so errors are displayed
    formik.setTouched(setNestedObjectValues(errors, true));

    console.log('values', formik.values);
    console.log('errors', errors);

    const isProjectValid = _.isEmpty(errors);

    if (isProjectValid) {
      if (
        desiredStep >= stepperStepsTranslationIds.length &&
        !apiResponseIsPending
      ) {
        formik.submitForm();
      } else {
        setTabValue(desiredStep);
      }
    }
  };

  // if project was successfully created, close modal
  const projectWasSuccessfullyCreated =
    notification?.id === 'project-successfully-created';
  useEffect(() => {
    if (projectWasSuccessfullyCreated) {
      onClose();
    }
  }, [notification]);

  return (
    <Formik
      validationSchema={projectSchema}
      initialValues={emptyProject}
      onSubmit={values => {
        const dataToSend = _.cloneDeep(values);
        cleanObjectFromEmptyFieldsOrArrays(dataToSend);
        dispatch(postNewProject(dataToSend));
      }}
    >
      {formik => (
        <Modal
          modalSizeAndPosition={modalSizeAndPosition}
          onOk={() => onChangeStepTo({ formik, desiredStep: tabValue + 1 })}
          onClose={onClose}
          modalType={modalTypeEnum.basic}
          title={intl.formatMessage({
            id: 'create-project',
          })}
          label={intl.formatMessage({
            id: tabValue < 7 ? 'next' : 'create-project',
          })}
          extraButtonLabel={tabValue > 0 ? 'Back' : undefined}
          extraButtonOnClick={() =>
            onChangeStepTo({
              formik,
              desiredStep: tabValue > 0 ? tabValue - 1 : tabValue,
            })
          }
          body={
            <StyledFormContainer>
              <Stepper activeStep={tabValue} alternativeLabel>
                {stepperStepsTranslationIds &&
                  stepperStepsTranslationIds.map((stepTranslationId, index) => (
                    <Step
                      key={index}
                      onClick={() =>
                        onChangeStepTo({ formik, desiredStep: index })
                      }
                      sx={{ cursor: 'pointer' }}
                    >
                      <StepLabel>
                        {intl.formatMessage({
                          id: stepTranslationId,
                        })}
                      </StepLabel>
                    </Step>
                  ))}
              </Stepper>
              <div>
                <TabPanel
                  style={{ paddingTop: '1.25rem' }}
                  value={tabValue}
                  index={0}
                >
                  <ProjectDetailsForm />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <FormikRepeater
                    empty={emptyIssuance}
                    name="issuances"
                    tooltip={intl.formatMessage({
                      id: 'issuances-optional',
                    })}
                    min={0}
                    Component={ProjectIssuanceForm}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <FormikRepeater
                    empty={emptyLocation}
                    name="projectLocations"
                    tooltip={intl.formatMessage({
                      id: 'locations-optional',
                    })}
                    min={0}
                    max={100}
                    Component={ProjectLocationForm}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  {/* <EstimationsRepeater
                  useToolTip={intl.formatMessage({
                    id: 'estimations-optional',
                  })}
                  estimationsState={project?.estimations ?? []}
                  setEstimationsState={value =>
                    setProject(prev => ({
                      ...prev,
                      estimations: value,
                    }))
                  }
                /> */}
                </TabPanel>
                <TabPanel value={tabValue} index={4}>
                  {/* <ProjectLabelsRepeater
                  useToolTip={intl.formatMessage({
                    id: 'labels-optional',
                  })}
                  labelsState={project?.labels ?? []}
                  newLabelsState={value =>
                    setProject(prev => ({
                      ...prev,
                      labels: value,
                    }))
                  }
                /> */}
                </TabPanel>
                <TabPanel value={tabValue} index={5}>
                  {/* <RatingsRepeater
                  useToolTip={intl.formatMessage({
                    id: 'ratings-optional',
                  })}
                  ratingsState={project?.projectRatings ?? []}
                  setRatingsState={value =>
                    setProject(prev => ({
                      ...prev,
                      projectRatings: value,
                    }))
                  }
                /> */}
                </TabPanel>
                <TabPanel value={tabValue} index={6}>
                  {/* <CoBenefitsRepeater
                  useToolTip={intl.formatMessage({
                    id: 'cobenefits-optional',
                  })}
                  coBenefitsState={project?.coBenefits ?? []}
                  setNewCoBenefitsState={value =>
                    setProject(prev => ({
                      ...prev,
                      coBenefits: value,
                    }))
                  }
                /> */}
                </TabPanel>
                <TabPanel value={tabValue} index={7}>
                  {/* <RelatedProjectsRepeater
                  useToolTip={intl.formatMessage({
                    id: 'relatedprojects-optional',
                  })}
                  relatedProjectsState={project?.relatedProjects ?? []}
                  setRelatedProjectsState={value =>
                    setProject(prev => ({
                      ...prev,
                      relatedProjects: value,
                    }))
                  }
                /> */}
                </TabPanel>
              </div>
            </StyledFormContainer>
          }
        />
      )}
    </Formik>
  );
};

export { ProjectCreateModal };
