import _ from 'lodash';
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { downloadTxtFile } from '../../utils/xlsxUtils';
import constants from '../../constants';
import { getUpdatedUrl } from '../../utils/urlUtils';
import { useWindowSize } from '../../components/hooks/useWindowSize';

import {
  deleteStagingData,
  getPaginatedData,
  retryStagingData,
  getStagingPaginatedData,
  getStagingData,
  deleteAllStagingData,
  getUnitData,
  clearUnitData,
} from '../../store/actions/climateWarehouseActions';
import { setPendingError } from '../../store/actions/app';

import {
  H3,
  APIDataTable,
  AddIcon,
  SearchInput,
  SelectSizeEnum,
  SelectTypeEnum,
  PrimaryButton,
  UnitCreateModal,
  DownloadIcon,
  Tab,
  Tabs,
  TabPanel,
  StagingDataGroups,
  SelectOrganizations,
  UploadXLSX,
  CommitModal,
  Modal,
  modalTypeEnum,
  RemoveIcon,
  UnitsDetailViewModal,
} from '../../components';
import theme from '../../theme';

const headings = [
  'projectLocationId',
  'unitOwner',
  'countryJurisdictionOfOwner',
  'inCountryJurisdictionOfOwner',
  'serialNumberBlock',
  'serialNumberPattern',
  'marketplace',
  'marketplaceLink',
  'marketplaceIdentifier',
  'unitTags',
  'unitStatusReason',
  'vintageYear',
  'unitRegistryLink',
  'unitType',
  'unitStatus',
  'correspondingAdjustmentDeclaration',
  'correspondingAdjustmentStatus',
];

const StyledSectionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledHeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  padding: 30px 24px 14px 16px;
`;

const StyledSearchContainer = styled('div')`
  max-width: 25.1875rem;
`;

const StyledFiltersContainer = styled('div')`
  margin: 0rem 1.2813rem;
`;

const StyledButtonContainer = styled('div')`
  margin-left: auto;
`;

const StyledSubHeaderContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 27.23px;
`;

const StyledBodyContainer = styled('div')`
  flex-grow: 1;
`;

const StyledCreateOneNowContainer = styled('div')`
  margin-left: 0.3125rem;
  display: inline-block;
  cursor: pointer;
  color: #1890ff;
`;

const NoDataMessageContainer = styled('div')`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StyledCSVOperationsContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  gap: 20px;

  svg {
    cursor: pointer;
  }
`;

const Units = () => {
  const dispatch = useDispatch();
  const [create, setCreate] = useState(false);
  const [isCommitModalVisible, setIsCommitModalVisible] = useState(false);
  const [isDeleteAllStagingVisible, setIsDeleteAllStagingVisible] =
    useState(false);
  const { notification } = useSelector(store => store.app);
  const intl = useIntl();
  let location = useLocation();
  let navigate = useNavigate();
  const { stagingData, units, unit, totalUnitsPages } = useSelector(
    store => store.climateWarehouse,
  );
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  let searchParams = new URLSearchParams(location.search);
  const unitsContainerRef = useRef(null);
  const [modalSizeAndPosition, setModalSizeAndPosition] = useState(null);
  const windowSize = useWindowSize();

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue],
  );

  useEffect(() => {
    const unitId = searchParams.get('unitId');
    if (unitId) {
      dispatch(getUnitData(unitId));
    }
    return () => dispatch(clearUnitData());
  }, [searchParams.get('unitId')]);

  const closeProjectOpenedInDetailedView = useCallback(() => {
    dispatch(clearUnitData());
    navigate(
      `${location.pathname}?${getUpdatedUrl(location.search, {
        param: 'unitId',
        value: null,
      })}`,
      { replace: true },
    );
  }, [location]);

  useEffect(() => {
    const switchTabBySuccessfulRequest = {
      'unit-deleted': 1,
      'unit-successfully-created': 1,
      'unit-successfully-edited': 1,
      'unit-successfully-split': 1,
      'transactions-committed': 2,
      'transactions-staged': 1,
    };
    if (switchTabBySuccessfulRequest[notification?.id]) {
      setTabValue(switchTabBySuccessfulRequest[notification.id]);
    }
  }, [notification]);

  useEffect(() => {
    setTabValue(0);
  }, [searchParams.get('orgUid')]);

  useEffect(() => {
    if (unitsContainerRef && unitsContainerRef.current) {
      setModalSizeAndPosition({
        left: unitsContainerRef.current.getBoundingClientRect().x,
        top: unitsContainerRef.current.getBoundingClientRect().y,
        width: unitsContainerRef.current.getBoundingClientRect().width,
        height: unitsContainerRef.current.getBoundingClientRect().height,
      });
    }
  }, [
    unitsContainerRef,
    unitsContainerRef.current,
    windowSize.height,
    windowSize.width,
  ]);

  const pageIsMyRegistryPage =
    searchParams.has('myRegistry') && searchParams.get('myRegistry') === 'true';

  const onSearch = useMemo(
    () =>
      _.debounce(event => {
        if (event.target.value !== '') {
          navigate(
            `${location.pathname}?${getUpdatedUrl(location.search, {
              param: 'search',
              value: event.target.value,
            })}`,
            { replace: true },
          );
        } else {
          navigate(
            `${location.pathname}?${getUpdatedUrl(location.search, {
              param: 'search',
              value: null,
            })}`,
            { replace: true },
          );
        }
        setSearchQuery(event.target.value);
      }, 300),
    [dispatch, location],
  );

  useEffect(() => {
    return () => {
      onSearch.cancel();
    };
  }, []);

  useEffect(() => {
    setSearchQuery(null);
  }, [searchParams.get('myRegistry')]);

  useEffect(() => {
    const options = {
      type: 'units',
      page: 1,
      resultsLimit: constants.MAX_TABLE_SIZE,
    };
    if (searchQuery) {
      options.searchQuery = searchQuery;
    }
    if (selectedOrganization && selectedOrganization !== 'all') {
      options.orgUid = selectedOrganization;
    }
    if (pageIsMyRegistryPage) {
      options.orgUid = searchParams.get('orgUid');
    }
    dispatch(getPaginatedData(options));
  }, [
    dispatch,
    tabValue,
    searchQuery,
    selectedOrganization,
    pageIsMyRegistryPage,
  ]);

  useEffect(() => {
    dispatch(getStagingData({ useMockedResponse: false }));
  }, [totalUnitsPages]);

  useEffect(() => {
    const options = {
      type: 'staging',
      page: 1,
      formType: 'Units',
      resultsLimit: constants.MAX_TABLE_SIZE,
    };
    dispatch(getStagingPaginatedData(options));
  }, [dispatch]);

  const filteredColumnsTableData = useMemo(() => {
    if (!units) {
      return null;
    }

    return units.map(unit =>
      _.pick(unit, [
        'warehouseUnitId',
        'unitOwner',
        'countryJurisdictionOfOwner',
        'serialNumberBlock',
        'unitCount',
        'vintageYear',
        'unitType',
        'marketplace',
        'unitTags',
        'unitStatus',
        'correspondingAdjustmentDeclaration',
        'correspondingAdjustmentStatus',
      ]),
    );
  }, [units]);

  const onOrganizationSelect = useCallback(
    selectedOption => {
      const orgUid = selectedOption[0].orgUid;
      setSelectedOrganization(orgUid);
      navigate(
        `${location.pathname}?${getUpdatedUrl(location.search, {
          param: 'orgUid',
          value: orgUid,
        })}`,
        { replace: true },
      );
    },
    [location, setSelectedOrganization],
  );

  if (!filteredColumnsTableData) {
    return null;
  }

  return (
    <>
      <StyledSectionContainer ref={unitsContainerRef}>
        <StyledHeaderContainer>
          <StyledSearchContainer>
            <SearchInput
              key={pageIsMyRegistryPage.toString()}
              size="large"
              onChange={onSearch}
              disabled={tabValue !== 0}
              outline
            />
          </StyledSearchContainer>
          {tabValue === 0 && !pageIsMyRegistryPage && (
            <StyledFiltersContainer>
              <SelectOrganizations
                size={SelectSizeEnum.large}
                type={SelectTypeEnum.basic}
                placeholder={intl.formatMessage({ id: 'filters' })}
                width="200px"
                onChange={onOrganizationSelect}
                displayAllOrganizations
              />
            </StyledFiltersContainer>
          )}
          <StyledButtonContainer>
            {tabValue === 0 && pageIsMyRegistryPage && (
              <PrimaryButton
                label={intl.formatMessage({ id: 'create' })}
                size="large"
                icon={
                  <AddIcon
                    width="16.13"
                    height="16.88"
                    fill={theme.colors.default.onButton}
                  />
                }
                onClick={() => {
                  if (
                    _.isEmpty(stagingData.units.pending) &&
                    _.isEmpty(stagingData.projects.pending)
                  ) {
                    setCreate(true);
                  } else {
                    dispatch(setPendingError(true));
                  }
                }}
              />
            )}

            {tabValue === 1 && stagingData.units.staging.length > 0 && (
              <PrimaryButton
                label={intl.formatMessage({ id: 'commit' })}
                size="large"
                onClick={() => setIsCommitModalVisible(true)}
              />
            )}

            {isCommitModalVisible && (
              <CommitModal
                onClose={() => setIsCommitModalVisible(false)}
                modalFor="units"
              />
            )}
          </StyledButtonContainer>
        </StyledHeaderContainer>
        <StyledSubHeaderContainer>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={`${intl.formatMessage({ id: 'committed' })} (${
                units && units?.length
              })`}
            />
            {pageIsMyRegistryPage && (
              <Tab
                label={`${intl.formatMessage({ id: 'staging' })} (${
                  stagingData && totalUnitsPages
                })`}
              />
            )}
            {pageIsMyRegistryPage && (
              <Tab
                label={`${intl.formatMessage({ id: 'pending' })} (${
                  stagingData && stagingData.units.pending.length
                })`}
              />
            )}
            {pageIsMyRegistryPage && (
              <Tab
                label={`${intl.formatMessage({ id: 'failed' })} (${
                  stagingData && stagingData.units.failed.length
                })`}
              />
            )}
          </Tabs>
          <StyledCSVOperationsContainer>
            {pageIsMyRegistryPage &&
              tabValue === 1 &&
              stagingData?.units?.staging?.length > 0 && (
                <span onClick={() => setIsDeleteAllStagingVisible(true)}>
                  <RemoveIcon width={20} height={20} />
                </span>
              )}
            <span onClick={() => downloadTxtFile('units', searchParams)}>
              <DownloadIcon width={20} height={20} />
            </span>
            {pageIsMyRegistryPage && (
              <span>
                <UploadXLSX type="units" />
              </span>
            )}
          </StyledCSVOperationsContainer>
        </StyledSubHeaderContainer>
        <StyledBodyContainer>
          <TabPanel value={tabValue} index={0}>
            {units && units.length === 0 && (
              <NoDataMessageContainer>
                <H3>
                  {!searchQuery && pageIsMyRegistryPage && (
                    <>
                      <FormattedMessage id="no-units-created" />
                      <StyledCreateOneNowContainer
                        onClick={() => {
                          if (
                            _.isEmpty(stagingData.units.pending) &&
                            _.isEmpty(stagingData.projects.pending)
                          ) {
                            setCreate(true);
                          } else {
                            dispatch(setPendingError(true));
                          }
                        }}
                      >
                        <FormattedMessage id="create-one-now" />
                      </StyledCreateOneNowContainer>
                    </>
                  )}
                  {!searchQuery && !pageIsMyRegistryPage && (
                    <FormattedMessage id="no-search-results" />
                  )}
                  {searchQuery && <FormattedMessage id="no-search-results" />}
                </H3>
              </NoDataMessageContainer>
            )}
            {units && units.length > 0 && (
              <>
                <APIDataTable
                  headings={Object.keys(filteredColumnsTableData[0])}
                  data={filteredColumnsTableData}
                  actions={'Units'}
                  modalSizeAndPosition={modalSizeAndPosition}
                  actionsAreDisplayed={pageIsMyRegistryPage}
                />
              </>
            )}
            {create && (
              <UnitCreateModal
                onClose={() => {
                  setCreate(false);
                }}
                modalSizeAndPosition={modalSizeAndPosition}
              />
            )}
          </TabPanel>
          {pageIsMyRegistryPage && (
            <>
              <TabPanel value={tabValue} index={1}>
                {stagingData && stagingData.units.staging.length === 0 && (
                  <NoDataMessageContainer>
                    <H3>
                      <FormattedMessage id="no-staged" />
                    </H3>
                  </NoDataMessageContainer>
                )}
                {stagingData && (
                  <StagingDataGroups
                    headings={headings}
                    data={stagingData.units.staging}
                    deleteStagingData={uuid =>
                      dispatch(deleteStagingData(uuid))
                    }
                    modalSizeAndPosition={modalSizeAndPosition}
                  />
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {stagingData && stagingData.units.pending.length === 0 && (
                  <NoDataMessageContainer>
                    <H3>
                      <FormattedMessage id="no-pending" />
                    </H3>
                  </NoDataMessageContainer>
                )}
                {stagingData && (
                  <StagingDataGroups
                    headings={headings}
                    data={stagingData.units.pending}
                    modalSizeAndPosition={modalSizeAndPosition}
                  />
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                {stagingData && stagingData.units.failed.length === 0 && (
                  <NoDataMessageContainer>
                    <H3>
                      <FormattedMessage id="no-failed" />
                    </H3>
                  </NoDataMessageContainer>
                )}
                {stagingData && (
                  <StagingDataGroups
                    headings={headings}
                    data={stagingData.units.failed}
                    deleteStagingData={uuid =>
                      dispatch(deleteStagingData(uuid))
                    }
                    retryStagingData={uuid => dispatch(retryStagingData(uuid))}
                    modalSizeAndPosition={modalSizeAndPosition}
                  />
                )}
              </TabPanel>
            </>
          )}
        </StyledBodyContainer>
      </StyledSectionContainer>
      {isDeleteAllStagingVisible && (
        <Modal
          title={intl.formatMessage({
            id: 'notification',
          })}
          body={intl.formatMessage({
            id: 'confirm-all-staging-data-deletion',
          })}
          modalType={modalTypeEnum.confirmation}
          onClose={() => setIsDeleteAllStagingVisible(false)}
          onOk={() => {
            dispatch(deleteAllStagingData());
            setIsDeleteAllStagingVisible(false);
          }}
        />
      )}
      {unit && (
        <UnitsDetailViewModal
          onClose={closeProjectOpenedInDetailedView}
          modalSizeAndPosition={modalSizeAndPosition}
          unitObject={unit}
        />
      )}
    </>
  );
};

export { Units };
