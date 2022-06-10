import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  H2,
  H4,
  Textarea,
  TextareaSizeEnum,
  TextareaStateEnum,
  PrimaryButton,
  Body,
} from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGovernanceOrgList,
  getIsGovernanceCreated,
  initiateGovernance,
  updateGovernanceOrgLists,
  updateGovernancePickLists,
} from '../../store/actions/climateWarehouseActions';
import { isJsonString } from '../../utils/json';

const StyledGovernanceContainer = styled('div')`
  padding: 30px 63px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledJSONSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
`;

const StyledJSONContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  textarea {
    height: 50vh;
  }
`;

const StyledButtonContainer = styled.div`
  width: fit-content;
`;

const Governance = () => {
  const intl = useIntl();
  const [picklistsTextarea, setPicklistsTextarea] = useState(
    JSON.stringify({}),
  );
  const [orgListTextarea, setOrgListTextarea] = useState(JSON.stringify([]));
  const { pickLists, governanceOrgList, isGovernanceCreated } = useSelector(
    store => store.climateWarehouse,
  );
  const dispatch = useDispatch();
  const [isGovernanceInitiated, setIsGovernanceInitiated] = useState(
    localStorage.getItem('IsGovernanceInitiated') || false,
  );

  useEffect(() => {
    dispatch(getGovernanceOrgList());
  }, []);

  useEffect(() => {
    setPicklistsTextarea(JSON.stringify(pickLists));
  }, [pickLists]);

  useEffect(() => {
    setOrgListTextarea(JSON.stringify(orgListTextarea));
  }, [governanceOrgList]);

  const arePickListsValid = useMemo(() => {
    const arePickListsAnObject =
      picklistsTextarea.length > 4 &&
      picklistsTextarea[0] === '{' &&
      picklistsTextarea[picklistsTextarea.length - 1] === '}';
    return arePickListsAnObject && isJsonString(picklistsTextarea);
  }, [picklistsTextarea]);

  const prettyfiedPicklists = useMemo(
    () =>
      arePickListsValid
        ? JSON.stringify(JSON.parse(picklistsTextarea), undefined, 4)
        : picklistsTextarea,
    [picklistsTextarea],
  );

  const isOrgListValid = useMemo(() => {
    const isOrgListAnArray =
      orgListTextarea.length > 4 &&
      orgListTextarea[0] === '[' &&
      orgListTextarea[orgListTextarea.length - 1] === ']';
    return isOrgListAnArray && isJsonString(orgListTextarea);
  }, [orgListTextarea]);

  const prettyfiedOrgList = useMemo(
    () =>
      isOrgListValid
        ? JSON.stringify(JSON.parse(orgListTextarea), undefined, 4)
        : orgListTextarea,
    [orgListTextarea],
  );

  const handleOnSend = useCallback(() => {
    if (isOrgListValid && arePickListsValid) {
      dispatch(updateGovernanceOrgLists(orgListTextarea));
      dispatch(updateGovernancePickLists(picklistsTextarea));
    }
  }, [isOrgListValid, arePickListsValid, orgListTextarea, picklistsTextarea]);

  const handleInitiateGovernance = useCallback(() => {
    dispatch(initiateGovernance());
    setIsGovernanceInitiated(true);
    localStorage.setItem('IsGovernanceInitiated', 'true');
  }, [isGovernanceCreated, setIsGovernanceInitiated]);

  // if governance is initiated, call api each 30 seconds to check whether governance has been created
  useEffect(() => {
    let id = null;
    if (isGovernanceInitiated) {
      id = window.setInterval(() => {
        if (!isGovernanceCreated) {
          dispatch(getIsGovernanceCreated());
        } else if (isGovernanceCreated) {
          clearInterval(id);
        }
      }, 30000);
    }
    if (id) return () => clearInterval(id);
  }, [isGovernanceInitiated, isGovernanceCreated]);

  return (
    <StyledGovernanceContainer>
      <H2>
        <FormattedMessage id="governance" />
      </H2>
      {isGovernanceCreated && (
        <StyledJSONSectionContainer>
          <StyledJSONContainer>
            <div>
              <H4>
                <FormattedMessage id="picklists" />
              </H4>
              {arePickListsValid && (
                <Body size="Small" color="green">
                  <FormattedMessage id="json-is-valid" />
                </Body>
              )}
              {!arePickListsValid && (
                <Body size="Small" color="red">
                  <FormattedMessage id="json-not-valid" />
                </Body>
              )}
            </div>
            <Textarea
              size={TextareaSizeEnum.large}
              placeholder={intl.formatMessage({
                id: 'picklists',
              })}
              value={prettyfiedPicklists}
              onChange={e => setPicklistsTextarea(e.target.value)}
              state={TextareaStateEnum.default}
            />
          </StyledJSONContainer>
          <StyledJSONContainer>
            <div>
              <H4>
                <FormattedMessage id="all-organizations" />
              </H4>
              {isOrgListValid && (
                <Body size="Small" color="green">
                  <FormattedMessage id="json-is-valid" />
                </Body>
              )}
              {!isOrgListValid && (
                <Body size="Small" color="red">
                  <FormattedMessage id="json-not-valid" />
                </Body>
              )}
            </div>
            <Textarea
              size={TextareaSizeEnum.large}
              placeholder={intl.formatMessage({
                id: 'all-organizations',
              })}
              value={prettyfiedOrgList}
              onChange={e => setOrgListTextarea(e.target.value)}
              state={TextareaStateEnum.default}
            />
          </StyledJSONContainer>
        </StyledJSONSectionContainer>
      )}
      <StyledButtonContainer>
        {!isGovernanceInitiated && (
          <PrimaryButton
            label={intl.formatMessage({ id: 'initiate-governance' })}
            size="large"
            onClick={handleInitiateGovernance}
          />
        )}
        {isGovernanceInitiated && !isGovernanceCreated && (
          <H4>
            <FormattedMessage id="governance-initiating-please-wait" />
          </H4>
        )}
        {isGovernanceCreated && (
          <PrimaryButton
            label={intl.formatMessage({ id: 'send' })}
            size="large"
            onClick={handleOnSend}
            disabled={!arePickListsValid || !isOrgListValid}
          />
        )}
      </StyledButtonContainer>
    </StyledGovernanceContainer>
  );
};

export { Governance };
