import _ from 'lodash';
import { keyMirror } from '../store-functions';
import constants from '../../constants';

import {
  coBenefitResponseStub,
  projectRatingResponseStub,
  qualificationsResponseStub,
  projectLocationsResponseStub,
  relatedProjectsResponseStub,
  unitsResponseStub,
  projectsResponseStub,
  vintagesResponseStub,
  stagingDataResponseStub,
  auditResponseStub,
} from '../../mocks';

import {
  activateProgressIndicator,
  deactivateProgressIndicator,
  lockApp,
  NotificationMessageTypeEnum,
  setConnectionCheck,
  setGlobalErrorMessage,
  setNotificationMessage,
  setReadOnly,
} from './app';
import { areUiAndDataModelMajorVersionsAMatch } from '../../utils/semverUtils';
import { getMyOrgUid } from '../../utils/getMyOrgUid';

export const actions = keyMirror(
  'GET_RATINGS',
  'GET_COBENEFITS',
  'GET_QUALIFICATIONS',
  'GET_PROJECT_LOCATIONS',
  'GET_RELATED_PROJECTS',
  'GET_UNITS',
  'GET_UNIT',
  'GET_UNITS_PAGE_COUNT',
  'GET_PROJECTS',
  'GET_PROJECT',
  'GET_PROJECTS_PAGE_COUNT',
  'GET_VINTAGES',
  'GET_STAGING_DATA',
  'GET_ORGANIZATIONS',
  'GET_PICKLISTS',
  'GET_ISSUANCES',
  'GET_LABELS',
  'GET_AUDIT',
  'GET_CONFLICTS',
  'GET_STAGING_PAGE_COUNT',
  'GET_STAGING_PROJECTS_PAGES',
  'GET_STAGING_UNITS_PAGES',
  'GET_MY_PROJECTS',
  'SET_MY_ORG_UID',
  'GET_GOVERNANCE_ORG_LIST',
  'SET_IS_GOVERNANCE',
  'GET_IS_GOVERNANCE_CREATED',
  'SET_IS_GOVERNANCE_INITIATED',
  'SET_WALLET_BALANCE',
  'SET_WALLET_STATUS',
);

const getClimateWarehouseTable = (
  url,
  action,
  mockAction,
  { useMockedResponse = false, useApiMock = false },
) => {
  return async dispatch => {
    dispatch(activateProgressIndicator);
    try {
      if (useMockedResponse) {
        dispatch(mockAction);
      } else {
        if (useApiMock) {
          url = `${url}?useMock=true`;
        }

        const response = await fetchWrapper(url);

        if (response.ok) {
          dispatch(setGlobalErrorMessage(null));
          dispatch(setConnectionCheck(true));
          const results = await response.json();

          dispatch({
            type: action,
            payload: results,
          });
        }
      }
    } catch (error) {
      dispatch(setConnectionCheck(false));
      dispatch(setGlobalErrorMessage('Something went wrong...'));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

const formatStagingData = dataArray => {
  const splittedByTable = _.groupBy(dataArray, 'table');

  splittedByTable.Projects = _.groupBy(splittedByTable.Projects, 'commited');

  splittedByTable.Units = _.groupBy(splittedByTable.Units, 'commited');

  const isNotFailedCommit = item => !item.failedCommit;
  const isFailedCommit = item => item.failedCommit;

  const splittedAndFormatted = {
    projects: {
      pending: [...(splittedByTable.Projects.true || [])].filter(
        isNotFailedCommit,
      ),
      staging: [...(splittedByTable.Projects.false || [])].filter(
        isNotFailedCommit,
      ),
      failed: [
        ...(splittedByTable.Projects.true || []),
        ...(splittedByTable.Projects.false || []),
      ].filter(isFailedCommit),
    },
    units: {
      pending: [...(splittedByTable.Units.true || [])].filter(
        isNotFailedCommit,
      ),
      staging: [...(splittedByTable.Units.false || [])].filter(
        isNotFailedCommit,
      ),
      failed: [
        ...(splittedByTable.Units.true || []),
        ...(splittedByTable.Units.false || []),
      ].filter(isFailedCommit),
    },
  };
  return splittedAndFormatted;
};

export const mockGetStagingDataResponse = {
  type: actions.GET_STAGING_DATA,
  payload: formatStagingData(
    _.get(stagingDataResponseStub, 'default', stagingDataResponseStub),
  ),
};

export const setMyOrgUid = uid => ({
  type: actions.SET_MY_ORG_UID,
  payload: uid,
});

export const setWalletBalance = balance => ({
  type: actions.SET_WALLET_BALANCE,
  payload: balance,
});

export const setWalletStatus = isWalletSynced => ({
  type: actions.SET_WALLET_STATUS,
  payload: isWalletSynced,
});

export const getOrganizationData = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(
        `${constants.API_HOST}/organizations`,
      );

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch(setReadOnly(response.headers.get('cw-read-only') === 'true'));
        dispatch(
          setIsGovernance(response.headers.get('x-governance-body') === 'true'),
        );

        const myOrgUid = getMyOrgUid(results);
        dispatch(setMyOrgUid(myOrgUid));

        const spendableBalance = results[myOrgUid]?.balance ?? null;
        dispatch(setWalletBalance(spendableBalance));

        const isWalletSynced =
          response.headers.get('x-wallet-synced') === 'true';
        dispatch(setWalletStatus(isWalletSynced));

        dispatch({
          type: actions.GET_ORGANIZATIONS,
          payload: results,
        });
      } else {
        dispatch(setConnectionCheck(false));
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const setIsGovernance = isGovernance => ({
  type: actions.SET_IS_GOVERNANCE,
  payload: isGovernance,
});

export const getIsGovernanceCreated = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(
        `${constants.API_HOST}/governance/exists`,
      );

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_IS_GOVERNANCE_CREATED,
          payload: results.created,
        });
      } else {
        dispatch(setConnectionCheck(false));
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getConflictsData = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(
        `${constants.API_HOST}/audit/findConflicts`,
      );

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_CONFLICTS,
          payload: results,
        });
      } else {
        dispatch(setConnectionCheck(false));
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getProjectData = id => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(
        `${constants.API_HOST}/projects?warehouseProjectId=${id}`,
      );

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_PROJECT,
          payload: results,
        });
      } else {
        dispatch(setConnectionCheck(false));
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getMyProjects = myOrgUid => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(
        `${constants.API_HOST}/projects?orgUid=${myOrgUid}`,
      );

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_MY_PROJECTS,
          payload: results,
        });
      } else {
        dispatch(setConnectionCheck(false));
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const clearProjectData = () => {
  return async dispatch => {
    dispatch({
      type: actions.GET_PROJECT,
      payload: null,
    });
  };
};

export const getUnitData = id => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(
        `${constants.API_HOST}/units?warehouseUnitId=${id}`,
      );

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_UNIT,
          payload: results,
        });
      } else {
        dispatch(setConnectionCheck(false));
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const clearUnitData = () => {
  return async dispatch => {
    dispatch({
      type: actions.GET_UNIT,
      payload: null,
    });
  };
};

export const getPickLists = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    const tryToGetPickListsFromStorage = () => {
      const fromStorage = localStorage.getItem('pickLists');
      if (fromStorage) {
        dispatch({
          type: actions.GET_PICKLISTS,
          payload: JSON.parse(fromStorage),
        });
      } else {
        dispatch(setGlobalErrorMessage('Something went wrong...'));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            'governance-data-failed',
          ),
        );
        dispatch(lockApp(true));
      }
    };

    try {
      const response = await fetch(
        `${constants.API_HOST}/governance/meta/pickList`,
      );

      if (response.ok) {
        dispatch(lockApp(false));
        dispatch(setConnectionCheck(true));

        const results = await response.json();
        dispatch({
          type: actions.GET_PICKLISTS,
          payload: results,
        });

        localStorage.setItem('pickLists', JSON.stringify(results));
      } else {
        tryToGetPickListsFromStorage();
      }
    } catch {
      dispatch(setConnectionCheck(false));
      tryToGetPickListsFromStorage();
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getGovernanceOrgList = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetch(
        `${constants.API_HOST}/governance/meta/orgList`,
      );

      if (response.ok) {
        dispatch(setConnectionCheck(true));

        const results = await response.json();
        dispatch({
          type: actions.GET_GOVERNANCE_ORG_LIST,
          payload: results,
        });
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getStagingData = ({ useMockedResponse = false }) => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      if (useMockedResponse) {
        dispatch(mockGetStagingDataResponse);
      } else {
        const response = await fetchWrapper(`${constants.API_HOST}/staging`);

        if (response.ok) {
          dispatch(setConnectionCheck(true));
          dispatch(setGlobalErrorMessage(null));
          const results = await response.json();

          dispatch({
            type: actions.GET_STAGING_DATA,
            payload: formatStagingData(results),
          });
          dispatch({
            type: actions.GET_STAGING_PROJECTS_PAGES,
            payload: formatStagingData(results).projects.staging.length,
          });
          dispatch({
            type: actions.GET_STAGING_UNITS_PAGES,
            payload: formatStagingData(results).units.staging.length,
          });
        }
      }
    } catch {
      dispatch(setGlobalErrorMessage('Something went wrong...'));
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getIssuances = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(`${constants.API_HOST}/issuances`);

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_ISSUANCES,
          payload: results,
        });
      }
    } catch {
      dispatch(setGlobalErrorMessage('Something went wrong...'));
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getLabels = () => {
  return async dispatch => {
    dispatch(activateProgressIndicator);

    try {
      const response = await fetchWrapper(`${constants.API_HOST}/labels`);

      if (response.ok) {
        dispatch(setGlobalErrorMessage(null));
        dispatch(setConnectionCheck(true));
        const results = await response.json();

        dispatch({
          type: actions.GET_LABELS,
          payload: results,
        });
      }
    } catch {
      dispatch(setGlobalErrorMessage('Something went wrong...'));
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const getPaginatedData = ({
  type,
  page,
  resultsLimit,
  searchQuery,
  orgUid,
}) => {
  return async dispatch => {
    const typeIsValid = type === 'projects' || type === 'units';
    const pageAndLimitAreValid =
      typeof page === 'number' && typeof resultsLimit === 'number';

    if (typeIsValid && pageAndLimitAreValid) {
      dispatch(activateProgressIndicator);
      try {
        let url = `${constants.API_HOST}/${type}?page=${page}&limit=${resultsLimit}`;
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (orgUid && typeof orgUid === 'string') {
          url += `&orgUid=${orgUid}`;
        }
        const response = await fetchWrapper(url);

        if (response.ok) {
          if (
            !areUiAndDataModelMajorVersionsAMatch(
              response.headers.get('x-datamodel-version'),
            )
          ) {
            dispatch(
              setNotificationMessage(
                NotificationMessageTypeEnum.error,
                'ui-data-model-mismatch',
              ),
            );
          }

          dispatch(setGlobalErrorMessage(null));
          dispatch(setConnectionCheck(true));
          const results = await response.json();

          let action = actions.GET_PROJECTS;
          let paginationAction = actions.GET_PROJECTS_PAGE_COUNT;
          if (type === 'units') {
            action = actions.GET_UNITS;
            paginationAction = actions.GET_UNITS_PAGE_COUNT;
          }

          dispatch({
            type: action,
            payload: results.data.map(result =>
              _.omit(result, 'timeStaged', 'createdAt', 'updatedAt'),
            ),
          });

          dispatch({
            type: paginationAction,
            payload: results.pageCount,
          });
        } else {
          const errorResponse = await response.json();
          dispatch(
            setNotificationMessage(
              NotificationMessageTypeEnum.error,
              formatApiErrorResponse(errorResponse, 'something-went-wrong'),
            ),
          );
        }
      } catch {
        dispatch(setGlobalErrorMessage('Something went wrong...'));
        dispatch(setConnectionCheck(false));
      } finally {
        dispatch(deactivateProgressIndicator);
      }
    }
  };
};

export const getStagingPaginatedData = ({
  type,
  formType,
  page,
  resultsLimit,
}) => {
  return async dispatch => {
    const pageAndLimitAreValid =
      typeof page === 'number' && typeof resultsLimit === 'number';

    if (pageAndLimitAreValid) {
      dispatch(activateProgressIndicator);
      try {
        let url = `${constants.API_HOST}/${type}?table=${formType}&page=${page}&limit=${resultsLimit}`;

        const response = await fetchWrapper(url);

        if (response.ok) {
          dispatch(setGlobalErrorMessage(null));
          dispatch(setConnectionCheck(true));
          const results = await response.json();
          let action = actions.GET_STAGING_DATA;
          let paginationAction = actions.GET_STAGING_PAGE_COUNT;

          dispatch({
            type: action,
            payload: formatStagingData(results.data.map(result => result)),
          });

          dispatch({
            type: paginationAction,
            payload: results.pageCount,
          });
        } else {
          const errorResponse = await response.json();
          dispatch(
            setNotificationMessage(
              NotificationMessageTypeEnum.error,
              formatApiErrorResponse(errorResponse, 'something-went-wrong'),
            ),
          );
        }
      } catch {
        dispatch(setGlobalErrorMessage('Something went wrong...'));
        dispatch(setConnectionCheck(false));
      } finally {
        dispatch(deactivateProgressIndicator);
      }
    }
  };
};

export const commitStagingData = (data, comment, author) => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/staging/commit${
        data === 'all' ? '' : `?table=${data}`
      }`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, author }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'transactions-committed',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'transactions-not-committed'),
          ),
        );
      }
    } catch {
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'transactions-not-committed',
        ),
      );
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const editStagingData = (uuid, data) => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/staging`;
      const payload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid, data }),
      };
      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'staging-group-edited',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'staging-group-could-not-be-edited',
            ),
          ),
        );
      }
    } catch {
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'staging-group-could-not-be-edited',
        ),
      );
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const updateGovernancePickLists = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/governance/meta/pickList`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'governance-picklists-updated-successfully',
          ),
        );
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'governance-picklists-update-failed',
            ),
          ),
        );
      }
    } catch {
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'governance-picklists-update-failed',
        ),
      );
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const setIsGovernanceInitiated = () => ({
  type: actions.SET_IS_GOVERNANCE_INITIATED,
  payload: true,
});

export const initiateGovernance = () => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/governance`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(setIsGovernanceInitiated());
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'governance-initiating-please-wait',
          ),
        );
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'governance-initiating-failed',
            ),
          ),
        );
      }
    } catch {
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'governance-initiating-failed',
        ),
      );
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const updateGovernanceOrgLists = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/governance/meta/orgList`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'governance-orglist-updated-successfully',
          ),
        );
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'governance-orglist-update-failed',
            ),
          ),
        );
      }
    } catch {
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'governance-orglist-update-failed',
        ),
      );
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const deleteStagingData = uuid => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/staging`;
      const payload = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'staging-group-deleted',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'staging-group-could-not-be-deleted',
            ),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'staging-group-could-not-be-deleted',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const deleteAllStagingData = () => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/staging/clean`;
      const payload = {
        method: 'DELETE',
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'delete-all-staging-data-success',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'delete-all-staging-data-error',
            ),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'delete-all-staging-data-error',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const retryStagingData = uuid => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/staging/retry`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'transactions-staged',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'transactions-not-staged'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'transactions-not-staged',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const deleteUnit = warehouseUnitId => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/units`;
      const payload = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ warehouseUnitId }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'unit-deleted',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'unit-could-not-be-deleted'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'unit-could-not-be-deleted',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const deleteProject = warehouseProjectId => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/projects`;
      const payload = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ warehouseProjectId }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'project-deleted',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'project-could-not-be-deleted',
            ),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'project-could-not-be-deleted',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const postNewProject = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/projects`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'project-successfully-created',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'project-not-created'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'project-not-created',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const updateProjectRecord = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/projects`;
      const payload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'project-successfully-edited',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(
              errorResponse,
              'project-could-not-be-edited',
            ),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'project-could-not-be-edited',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const postNewOrg = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const formData = new FormData();
      formData.append('file', data.png);
      formData.append('name', data.name);

      const url = `${constants.API_HOST}/organizations/create`;
      const payload = {
        method: 'POST',
        body: formData,
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(getOrganizationData());
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'organization-created',
          ),
        );
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'organization-not-created'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'organization-not-created',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const editExistingOrg = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const formData = new FormData();
      formData.append('file', data.png);
      formData.append('name', data.name);

      const url = `${constants.API_HOST}/organizations/edit`;
      const payload = {
        method: 'PUT',
        body: formData,
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(getOrganizationData());
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'organization-edited',
          ),
        );
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'organization-not-edited'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'organization-not-edited',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const importHomeOrg = orgUid => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/organizations`;

      const payload = {
        method: 'PUT',
        body: JSON.stringify({ orgUid }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(getOrganizationData());
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'organization-created',
          ),
        );
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'organization-not-created'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'organization-not-created',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const subscribeToOrg = orgUid => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/organizations/subscribe`;

      const payload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orgUid }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(getOrganizationData());
      } else {
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            'something-went-wrong',
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const unsubscribeFromOrg = orgUid => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/organizations/unsubscribe`;

      const payload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orgUid }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(getOrganizationData());
      } else {
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            'something-went-wrong',
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const subscribeImportOrg = ({ orgUid, ip, port }) => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/organizations/import`;

      const payload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orgUid, ip, port }),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'organization-is-importing',
          ),
        );
        dispatch(getOrganizationData());
      } else {
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            'something-went-wrong',
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const uploadXLSXFile = (file, type) => {
  return async dispatch => {
    if (type === 'projects' || type === 'units') {
      try {
        dispatch(activateProgressIndicator);
        const formData = new FormData();
        formData.append('xlsx', file);
        const url = `${constants.API_HOST}/${type}/xlsx`;
        const payload = {
          method: 'PUT',
          body: formData,
        };

        const response = await fetchWrapper(url, payload);

        if (response.ok) {
          dispatch(setConnectionCheck(true));
          dispatch(
            setNotificationMessage(
              NotificationMessageTypeEnum.success,
              'upload-successful',
            ),
          );
          dispatch(getStagingData({ useMockedResponse: false }));
        } else {
          const errorResponse = await response.json();
          dispatch(
            setNotificationMessage(
              NotificationMessageTypeEnum.error,
              formatApiErrorResponse(errorResponse, errorResponse.error),
            ),
          );
        }
      } catch {
        dispatch(setConnectionCheck(false));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            'file-could-not-be-uploaded',
          ),
        );
      } finally {
        dispatch(deactivateProgressIndicator);
      }
    }
  };
};

export const postNewUnits = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/units`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'unit-successfully-created',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'unit-not-created'),
          ),
        );
      }
    } catch (err) {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'unit-not-created',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const splitUnits = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/units/split`;
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'unit-successfully-split',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'unit-could-not-be-split'),
          ),
        );
      }
    } catch (err) {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'unit-could-not-be-split',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

export const updateUnitsRecord = data => {
  return async dispatch => {
    try {
      dispatch(activateProgressIndicator);

      const url = `${constants.API_HOST}/units`;
      const payload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetchWrapper(url, payload);

      if (response.ok) {
        dispatch(setConnectionCheck(true));
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.success,
            'unit-successfully-edited',
          ),
        );
        dispatch(getStagingData({ useMockedResponse: false }));
      } else {
        const errorResponse = await response.json();
        dispatch(
          setNotificationMessage(
            NotificationMessageTypeEnum.error,
            formatApiErrorResponse(errorResponse, 'unit-could-not-be-edited'),
          ),
        );
      }
    } catch {
      dispatch(setConnectionCheck(false));
      dispatch(
        setNotificationMessage(
          NotificationMessageTypeEnum.error,
          'unit-could-not-be-edited',
        ),
      );
    } finally {
      dispatch(deactivateProgressIndicator);
    }
  };
};

const mockedRatingsResponse = {
  type: actions.GET_RATINGS,
  // Different envs import this differently
  payload: _.get(
    projectRatingResponseStub,
    'default',
    projectRatingResponseStub,
  ),
};

export const getRatings = options => {
  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        `${constants.API_HOST}/ratings`,
        actions.GET_RATINGS,
        mockedRatingsResponse,
        options,
      ),
    );
  };
};

export const getAudit = options => {
  return dispatch => {
    if (options?.orgUid && options?.limit && options?.page) {
      dispatch(
        getClimateWarehouseTable(
          `${constants.API_HOST}/audit?orgUid=${options.orgUid}&limit=${options.limit}&page=${options.page}&order=${options.order}`,
          actions.GET_AUDIT,
          mockedAuditResponse({
            orgUid: options.orgUid,
            limit: options.limit,
            page: options?.page,
          }),
          options,
        ),
      );
    }
  };
};

const mockedAuditResponse = ({ page, limit, orgUid }) => {
  const customAuditResponseStub = {
    page: page,
    pageCount: auditResponseStub.pageCount,
    data: auditResponseStub.data.reduce((accumulator, current, index) => {
      if (index < limit) {
        return [...accumulator, { ...current, orgUid }];
      }
      return accumulator;
    }, []),
  };

  // Different envs import this differently
  return {
    type: actions.GET_AUDIT,
    payload: _.get(customAuditResponseStub, 'default', customAuditResponseStub),
  };
};

const mockedCoBenefitResponse = {
  type: actions.GET_COBENEFITS,
  // Different envs import this differently
  payload: _.get(coBenefitResponseStub, 'default', coBenefitResponseStub),
};

export const getCoBenefits = options => {
  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        `${constants.API_HOST}/co-benefits`,
        actions.GET_COBENEFITS,
        mockedCoBenefitResponse,
        options,
      ),
    );
  };
};

export const mockQualificationsResponse = {
  type: actions.GET_QUALIFICATIONS,
  // Different envs import this differently
  payload: _.get(
    qualificationsResponseStub,
    'default',
    qualificationsResponseStub,
  ),
};

export const getQualifications = options => {
  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        `${constants.API_HOST}/qualifications`,
        actions.GET_QUALIFICATIONS,
        mockQualificationsResponse,
        options,
      ),
    );
  };
};

export const mockProjectLocationsResponse = {
  type: actions.GET_PROJECT_LOCATIONS,
  // Different envs import this differently
  payload: _.get(
    projectLocationsResponseStub,
    'default',
    projectLocationsResponseStub,
  ),
};

export const getProjectLocations = options => {
  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        `${constants.API_HOST}/locations`,
        actions.GET_PROJECT_LOCATIONS,
        mockProjectLocationsResponse,
        options,
      ),
    );
  };
};

export const mockRelatedProjectsResponse = {
  type: actions.GET_RELATED_PROJECTS,
  // Different envs import this differently
  payload: _.get(
    relatedProjectsResponseStub,
    'default',
    relatedProjectsResponseStub,
  ),
};

export const getRelatedProjects = options => {
  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        `${constants.API_HOST}/related-projects`,
        actions.GET_RELATED_PROJECTS,
        mockRelatedProjectsResponse,
        options,
      ),
    );
  };
};

export const mockUnitsResponse = {
  type: actions.GET_UNITS,
  // Different envs import this differently
  payload: _.get(unitsResponseStub, 'default', unitsResponseStub),
};

export const getUnits = options => {
  const url = options?.searchQuery
    ? `${constants.API_HOST}/units?search=${options.searchQuery}`
    : `${constants.API_HOST}/units`;

  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        url,
        actions.GET_UNITS,
        mockUnitsResponse,
        options,
      ),
    );
  };
};

export const mockProjectsResponse = {
  type: actions.GET_PROJECTS,
  // Different envs import this differently
  payload: _.get(projectsResponseStub, 'default', projectsResponseStub),
};

export const getProjects = options => {
  let url = `${constants.API_HOST}/projects?`;

  if (options?.searchQuery) {
    url += `search=${options.searchQuery}`;
  }
  if (options?.orgUid) {
    url += `orgUid=${options.orgUid}`;
  }

  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        url,
        actions.GET_PROJECTS,
        mockProjectsResponse,
        options,
      ),
    );
  };
};

export const mockVintagesResponse = {
  type: actions.GET_VINTAGES,
  // Different envs import this differently
  payload: _.get(vintagesResponseStub, 'default', vintagesResponseStub),
};

export const getVintages = options => {
  return dispatch => {
    dispatch(
      getClimateWarehouseTable(
        `${constants.API_HOST}/vintages`,
        actions.GET_VINTAGES,
        mockVintagesResponse,
        options,
      ),
    );
  };
};

// TODO to replace with an extended wrapper that also adds try catch finally and also handles network connection and progress indicator dispatches
const fetchWrapper = async (url, payload) => {
  const apiKey = localStorage.getItem('apiKey');
  const serverAddress = localStorage.getItem('serverAddress');
  const doesSignInDataExist = apiKey != null && serverAddress != null;

  if (doesSignInDataExist) {
    const payloadWithApiKey = { ...payload };
    if (payloadWithApiKey?.headers) {
      payloadWithApiKey.headers = {
        ...payloadWithApiKey.headers,
        'x-api-key': apiKey,
      };
    } else {
      payloadWithApiKey.headers = { 'x-api-key': apiKey };
    }

    const serverAddressUrl =
      serverAddress[serverAddress.length - 1] !== '/'
        ? `${serverAddress}/`
        : serverAddressUrl;

    const newUrl = url.replace(
      /(https:|http:|)(^|\/\/)(.*?\/)/g,
      serverAddressUrl,
    );

    return fetch(newUrl, payloadWithApiKey);
  }

  return fetch(url, payload);
};

const formatApiErrorResponse = ({ errors, message }, alternativeResponseId) => {
  if (!_.isEmpty(errors) && !_.isEmpty(message)) {
    let notificationToDisplay = message + ': ';
    errors.forEach(item => {
      notificationToDisplay = notificationToDisplay.concat(item, ' ; ');
    });
    return notificationToDisplay;
  }
  return alternativeResponseId;
};
