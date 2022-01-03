import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  StandardInput,
  InputSizeEnum,
  InputStateEnum,
  Modal,
  Tabs,
  Tab,
  TabPanel,
  ModalFormContainerStyle,
  FormContainerStyle,
  BodyContainer,
  Body,
} from '..';
import QualificationsRepeater from './QualificationsRepeater';
import VintageRepeater from './VintageRepeater';
import CoBenefitsRepeater from './CoBenefitsRepeater';
import ProjectLocationsRepeater from './ProjectLocationsRepeater';
import RelatedProjectsRepeater from './RelatedProjectsRepeater';
import { updateUnitsRecord } from '../../store/actions/climateWarehouseActions';
import { useIntl } from 'react-intl';

const StyledLabelContainer = styled('div')`
  margin-bottom: 0.5rem;
`;

const StyledFieldContainer = styled('div')`
  padding-bottom: 1.25rem;
`;
const InputContainer = styled('div')`
  width: 20rem;
`;

const EditProjectsForm = ({ data, onClose }) => {
  const [qualification, setQualificationsRepeaterValues] = useState([]);
  const [vintage, setVintage] = useState([]);
  const [projectLocations, setProjectLocations] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [coBenefits, setCoBenefits] = useState([]);
  const [editedProjects, setEditProjects] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const dispatch = useDispatch();
  const intl = useIntl();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setEditProjects({
      currentRegistry: data.currentRegistry,
      registryOfOrigin: data.registryOfOrigin,
      originProjectId: data.originProjectId,
      program: data.program,
      projectID: data.projectID,
      projectName: data.projectName,
      projectLink: data.projectLink,
      projectDeveloper: data.projectDeveloper,
      sector: data.sector,
      projectType: data.projectType,
      coveredByNDC: data.coveredByNDC,
      NDCLinkage: data.NDCLinkage,
      projectStatus: data.projectStatus,
      projectStatusDate: data.projectStatusDate,
      unitMetric: data.unitMetric,
      methodology: data.methodology,
      methodologyVersion: data.methodologyVersion,
      validationApproach: data.validationApproach,
      validationDate: data.validationDate,
      estimatedAnnualAverageEmissionReduction:
        data.estimatedAnnualAverageEmissionReduction,
      projectTag: data.projectTag,
    });
    setVintage(_.get(data, 'vintages', []));
    setProjectLocations(_.get(data, 'projectLocations', []));
    setCoBenefits(_.get(data, 'coBenefits', []));
    setQualificationsRepeaterValues(_.get(data, 'qualifications', []));
    setRelatedProjects(_.get(data, 'relatedProjects', []));
  }, [data]);

  const handleEditUnits = () => {
    const dataToSend = _.cloneDeep(editedProjects);
    dataToSend.vintage = _.head(vintage);
    dataToSend.qualification = qualification;
    dataToSend.coBenefits = coBenefits;
    dataToSend.projectLocations = projectLocations;
    dataToSend.relatedProjects = relatedProjects;
    dispatch(updateUnitsRecord(dataToSend));
  };
  return (
    <>
      <Modal
        onOk={handleEditUnits}
        onClose={onClose}
        basic
        form
        showButtons
        title="Edit Projects"
        body={
          <div>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Project" />
              <Tab label="Qualifications" />
              <Tab label="Vintages" />
              <Tab label="Co-Benefits" />
              <Tab label="Project Locations" />
              <Tab label="Related Projects" />
            </Tabs>
            <div>
              <TabPanel
                style={{ paddingTop: '1.25rem' }}
                value={tabValue}
                index={0}>
                <ModalFormContainerStyle>
                  <FormContainerStyle>
                    <BodyContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'current-registry' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'current-registry',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.currentRegistry}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                currentRegistry: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'registry-of-origin' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'registry-of-origin',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.registryOfOrigin}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                registryOfOrigin: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'origin-project-id' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'origin-project-id',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.originProjectId}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                originProjectId: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'program' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'program',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.program}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                program: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-id' })}
                          </Body>
                        </StyledLabelContainer>
                        <StandardInput
                          size={InputSizeEnum.large}
                          placeholderText={intl.formatMessage({
                            id: 'project-id',
                          })}
                          state={InputStateEnum.default}
                          value={editedProjects.projectID}
                          onChange={value =>
                            setEditProjects(prev => ({
                              ...prev,
                              projectID: value,
                            }))
                          }
                        />
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-name' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-name',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.projectName}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                projectName: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-link' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-link',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.projectLink}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                projectLink: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-developer' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-developer',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.projectDeveloper}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                projectDeveloper: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'sector' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'sector',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.sector}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                sector: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-type' })}
                          </Body>
                        </StyledLabelContainer>
                        <StandardInput
                          size={InputSizeEnum.large}
                          placeholderText={intl.formatMessage({
                            id: 'project-type',
                          })}
                          state={InputStateEnum.default}
                          value={editedProjects.projectType}
                          onChange={value =>
                            setEditProjects(prev => ({
                              ...prev,
                              projectType: value,
                            }))
                          }
                        />
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'covered-by-ndc' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'covered-by-ndc',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.coveredByNDC}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                coveredByNDC: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                    </BodyContainer>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'ndc-linkage' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'ndc-linkage',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.NDCLinkage}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                NDCLinkage: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-status' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-status',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.projectStatus}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                projectStatus: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-status-date' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-status-date',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.projectStatusDate}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                projectStatusDate: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'unit-metric' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'unit-metric',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.unitMetric}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                unitMetric: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'methodology' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'methodology',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.methodology}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                methodology: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'methodology-version' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'methodology-version',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.methodologyVersion}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                methodologyVersion: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'validation-approach' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'validation-approach',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.validationApproach}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                validationApproach: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'validation-date' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'validation-date',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.validationDate}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                validationDate: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({
                              id: 'estimated-annual-average-emission-reduction',
                            })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'estimated-annual-average-emission-reduction',
                            })}
                            state={InputStateEnum.default}
                            value={
                              editedProjects.estimatedAnnualAverageEmissionReduction
                            }
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                estimatedAnnualAverageEmissionReduction: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                      <StyledFieldContainer>
                        <StyledLabelContainer>
                          <Body style={{ color: '#262626' }}>
                            {intl.formatMessage({ id: 'project-tag' })}
                          </Body>
                        </StyledLabelContainer>
                        <InputContainer>
                          <StandardInput
                            size={InputSizeEnum.large}
                            placeholderText={intl.formatMessage({
                              id: 'project-tag',
                            })}
                            state={InputStateEnum.default}
                            value={editedProjects.projectTag}
                            onChange={value =>
                              setEditProjects(prev => ({
                                ...prev,
                                projectTag: value,
                              }))
                            }
                          />
                        </InputContainer>
                      </StyledFieldContainer>
                    </div>
                  </FormContainerStyle>
                </ModalFormContainerStyle>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <QualificationsRepeater
                  qualificationsState={qualification}
                  newQualificationsState={setQualificationsRepeaterValues}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <VintageRepeater
                  vintageState={vintage}
                  newVintageState={setVintage}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <CoBenefitsRepeater
                  coBenefitsState={coBenefits}
                  setNewCoBenefitsState={setCoBenefits}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <ProjectLocationsRepeater
                  projectLocationsState={projectLocations}
                  setProjectLocationsState={setProjectLocations}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <RelatedProjectsRepeater
                  relatedProjectsState={relatedProjects}
                  setRelatedProjectsState={setRelatedProjects}
                />
              </TabPanel>
            </div>
          </div>
        }
      />
    </>
  );
};

export { EditProjectsForm };
