import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Body,
  MagnifyGlassIcon,
  SelectOrganizations,
  SelectSizeEnum,
  SelectTypeEnum,
  AuditItemModal,
  DescendingClockIcon,
  AscendingClockIcon,
  H3,
  Pagination,
} from '../../components';
import {
  getAudit,
  getOrganizationData,
} from '../../store/actions/climateWarehouseActions';
import constants from '../../constants';

const StyledSectionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledHeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 24px 30px 16px;
`;

const StyledBodyContainer = styled('div')`
  flex-grow: 1;
  overflow: scroll;
`;

const StyledBodyNoDataFound = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledTable = styled('table')`
  width: 100%;
`;

const StyledTh = styled('th')`
  text-align: start;
  padding: 17px;
  background-color: ${props =>
    props.theme.colors.default.status.info.secondary};
  position: sticky;
  top: 0;
`;

const StyledTd = styled('td')`
  text-align: start;
  padding: 17px;
`;

const StyledTr = styled('tr')`
  :nth-child(even) {
    background-color: ${props => props.theme.colors.default.background};
  }
`;

const StyledSortButtonContainer = styled.div`
  margin-left: 10px;
  border: 0.0625rem solid #d9d9d9;
  height: 2.5rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  min-width: 200px;
  cursor: pointer;
`;

const StyledIconContainer = styled('div')`
  color: ${props => props.theme.colors.default.primary};
  cursor: zoom-in;
`;

const Audit = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const { audit, organizations } = useSelector(store => store.climateWarehouse);
  const [selectedOrgUid, setSelectedOrgUid] = useState(null);
  const [selectedAuditItem, setSelectedAuditItem] = useState(null);
  const [auditSortOrder, setAuditSortOrder] = useState('DESC');

  useEffect(() => {
    dispatch(getOrganizationData());
    const storageAuditSortOrder = localStorage.getItem('auditSortOrder');
    if (storageAuditSortOrder) {
      setAuditSortOrder(storageAuditSortOrder);
    }
  }, []);

  const changeSortOrder = useCallback(() => {
    const newSortOrder = auditSortOrder === 'DESC' ? 'ASC' : 'DESC';
    localStorage.setItem('auditSortOrder', newSortOrder);
    setAuditSortOrder(newSortOrder);
    dispatch(
      getAudit({
        orgUid: selectedOrgUid,
        page: 1,
        limit: constants.MAX_AUDIT_TABLE_SIZE,
        useMockedResponse: false,
        order: newSortOrder,
      }),
    );
  }, [auditSortOrder, setAuditSortOrder, selectedOrgUid]);

  const onOrganizationSelect = useCallback(
    selectedOption => {
      const orgUid = selectedOption[0].orgUid;
      setSelectedOrgUid(orgUid);
      dispatch(
        getAudit({
          orgUid,
          page: 1,
          limit: constants.MAX_AUDIT_TABLE_SIZE,
          useMockedResponse: false,
          order: auditSortOrder,
        }),
      );
    },
    [setSelectedOrgUid, auditSortOrder],
  );

  const closeAuditItemModal = useCallback(
    () => setSelectedAuditItem(null),
    [setSelectedAuditItem],
  );

  if (!organizations) {
    return null;
  }

  return (
    <StyledSectionContainer>
      <StyledHeaderContainer>
        <SelectOrganizations
          size={SelectSizeEnum.large}
          type={SelectTypeEnum.basic}
          placeholder={intl.formatMessage({ id: 'select-organization' })}
          width="200px"
          onChange={onOrganizationSelect}
        />

        {selectedOrgUid && (
          <>
            <StyledSortButtonContainer onClick={changeSortOrder}>
              {auditSortOrder === 'ASC' ? (
                <>
                  <Body>
                    <FormattedMessage id="sort-descending" />
                  </Body>
                  <StyledIconContainer>
                    <AscendingClockIcon width={'1.5em'} height={'1.5em'} />
                  </StyledIconContainer>
                </>
              ) : (
                <>
                  <Body>
                    <FormattedMessage id="sort-ascending" />
                  </Body>
                  <StyledIconContainer>
                    <DescendingClockIcon width={'1.5em'} height={'1.5em'} />
                  </StyledIconContainer>
                </>
              )}
            </StyledSortButtonContainer>

            {selectedOrgUid && audit?.page && audit?.pageCount && (
              <Pagination
                current={audit.page - 1}
                pages={audit.pageCount}
                callback={val =>
                  dispatch(
                    getAudit({
                      orgUid: selectedOrgUid,
                      page: val + 1,
                      limit: constants.MAX_AUDIT_TABLE_SIZE,
                      useMockedResponse: false,
                      order: auditSortOrder,
                    }),
                  )
                }
                showLast
              />
            )}

            <div>
              <Body>
                {intl.formatMessage({ id: 'org-uid' })}: {selectedOrgUid}
              </Body>
            </div>
          </>
        )}
      </StyledHeaderContainer>
      {!audit?.data && (
        <StyledBodyNoDataFound>
          <H3>
            <FormattedMessage id="no-audit-data" />
          </H3>
        </StyledBodyNoDataFound>
      )}
      {selectedOrgUid && audit?.data?.length > 0 && (
        <StyledBodyContainer>
          <StyledTable>
            <thead>
              <StyledTr>
                <StyledTh></StyledTh>
                <StyledTh>
                  <Body size="Bold">
                    <FormattedMessage id="table" />
                  </Body>
                </StyledTh>
                <StyledTh>
                  <Body size="Bold">
                    <FormattedMessage id="timestamp" />
                  </Body>
                </StyledTh>
                <StyledTh>
                  <Body size="Bold">
                    <FormattedMessage id="type" />
                  </Body>
                </StyledTh>
                <StyledTh>
                  <Body size="Bold">
                    <FormattedMessage id="root-hash" />
                  </Body>
                </StyledTh>
                <StyledTh>
                  <Body size="Bold">
                    <FormattedMessage id="author" />
                  </Body>
                </StyledTh>
                <StyledTh>
                  <Body size="Bold">
                    <FormattedMessage id="comment" />
                  </Body>
                </StyledTh>
              </StyledTr>
            </thead>
            <tbody>
              {audit?.data?.length &&
                audit?.data.map(auditItem => (
                  <StyledTr key={auditItem.id}>
                    <StyledTd>
                      {auditItem.change && (
                        <StyledIconContainer
                          onClick={() => setSelectedAuditItem(auditItem)}
                        >
                          <MagnifyGlassIcon />
                        </StyledIconContainer>
                      )}
                    </StyledTd>
                    <StyledTd>
                      <Body>{auditItem.table}</Body>
                    </StyledTd>
                    <StyledTd>
                      <Body>
                        {dayjs(
                          auditItem.onchainConfirmationTimeStamp * 1000,
                        ).format('YYYY-MM-DD HH:mm:ss')}
                      </Body>
                    </StyledTd>
                    <StyledTd>
                      <Body>{auditItem.type}</Body>
                    </StyledTd>
                    <StyledTd>
                      <Body>{auditItem.rootHash}</Body>
                    </StyledTd>
                    <StyledTd>
                      <Body>{auditItem.author}</Body>
                    </StyledTd>
                    <StyledTd>
                      <Body>{auditItem.comment}</Body>
                    </StyledTd>
                  </StyledTr>
                ))}
            </tbody>
          </StyledTable>
        </StyledBodyContainer>
      )}
      {selectedAuditItem && (
        <AuditItemModal
          onClose={closeAuditItemModal}
          auditItem={selectedAuditItem}
        />
      )}
    </StyledSectionContainer>
  );
};

export { Audit };
