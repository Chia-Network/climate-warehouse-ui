import React, { useEffect, useRef, useState } from 'react';
import styled, { withTheme } from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { convertPascalCaseToSentenceCase } from '../../utils/stringUtils';
import { getDiff } from '../../utils/objectUtils';
import { Modal, MinusIcon, Body, ErrorIcon, SuccessIcon, ReloadIcon } from '..';
import { modalTypeEnum, APIStagingPagination } from '.';
import { useWindowSize } from '../hooks/useWindowSize';
import { DetailedViewStagingModal } from './DetailedViewStagingModal';

const StyledPaginationContainer = styled('div')`
  box-sizing: border-box;
  background-color: white;
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
  width: 100%;
  max-height: 70px;
  margin: 25px 0px 25px 0px;
`;

const StyledChangeGroup = styled('div')`
  background: ${props => props.theme.colors.default.background};
  margin: 20px 20px 20px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  padding: 45px 0px 40px 0px;
  gap: 20px;
`;

const StyledChangeCard = styled('div')`
  background-color: white;
  width: 30%;
  min-width: 300px;
  max-width: 500px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%),
    0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%);
`;

const StyledChangeCardTitle = styled('div')`
  ${props =>
    props.displayInRed
      ? ` background-color: ${props.theme.colors.default.status.error.secondary};
      border: 2px solid ${props.theme.colors.default.status.error.primary};
      body {
        color: ${props.theme.colors.default.status.error.primary};
      }`
      : ` background-color: ${props.theme.colors.default.status.ok.secondary};
      border: 2px solid ${props.theme.colors.default.status.ok.primary};
      body {
        color: ${props.theme.colors.default.status.ok.primary};
      }`}
  padding: 15px 5px 8px 17px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const StyledChangeCardBody = styled('div')`
  padding: 8px 17px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 2px solid #e5e5e5;
  border-top: none;
`;

const StyledCardBodyItem = styled('div')`
  padding: 4px;
  body {
    word-break: break-all;
  }
`;

const StyledDeleteGroupIcon = styled('div')`
  position: absolute;
  top: 16px;
  right: 20px;
  cursor: pointer;
`;

const StyledRetryGroupIcon = styled('div')`
  position: absolute;
  top: 16px;
  right: 50px;
  cursor: pointer;
`;

const StagingDataGroupsContainer = styled('div')`
  height: 100%;
`;

const StyledCardBodySubItem = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  word-wrap: break-word;
`;

const StyledWordWrap = styled('div')`
  word-break: break-word;
  display: inline-block;
`;

const ChangeCard = ({
  headings,
  data,
  displayInRed,
  onClick,
  title,
  deletedIsVsible,
  addedIsVisible,
}) => {
  return (
    <StyledChangeCard onClick={onClick}>
      <StyledChangeCardTitle displayInRed={displayInRed}>
        <Body size="Bold">{title}</Body>
      </StyledChangeCardTitle>
      <StyledChangeCardBody>
        {headings &&
          headings
            .filter(
              heading =>
                heading !== 'unitBlockEnd' && heading !== 'unitBlockStart',
            )
            .map((heading, index) => (
              <>
                {!(typeof data[heading] === 'object') && (
                  <StyledCardBodyItem key={index}>
                    <Body size="Small Bold">
                      {convertPascalCaseToSentenceCase(heading)}
                    </Body>
                    <StyledCardBodySubItem>
                      <StyledWordWrap>
                        <Body>{data[heading] ? data[heading] : '--'}</Body>
                      </StyledWordWrap>
                      <span>
                        {deletedIsVsible && (
                          <ErrorIcon width="17" height="17" />
                        )}
                        {addedIsVisible && (
                          <SuccessIcon width="17" height="17" />
                        )}
                      </span>
                    </StyledCardBodySubItem>
                  </StyledCardBodyItem>
                )}
                {typeof data[heading] === 'object' && (
                  <StyledCardBodyItem key={index}>
                    <Body size="Small Bold">
                      {convertPascalCaseToSentenceCase(heading)}
                    </Body>
                    <StyledCardBodySubItem>
                      <span>
                        <Body>
                          <FormattedMessage id="click-for-details" />
                        </Body>
                      </span>
                      <span>
                        {deletedIsVsible && (
                          <ErrorIcon width="17" height="17" />
                        )}
                        {addedIsVisible && (
                          <SuccessIcon width="17" height="17" />
                        )}
                      </span>
                    </StyledCardBodySubItem>
                  </StyledCardBodyItem>
                )}
              </>
            ))}
      </StyledChangeCardBody>
    </StyledChangeCard>
  );
};

const InvalidChangeCard = ({ onDeleteChangeGroup, title }) => {
  return (
    <StyledChangeCard onClick={onDeleteChangeGroup}>
      <StyledChangeCardTitle displayInRed>
        <Body size="Bold">{title}</Body>
      </StyledChangeCardTitle>
      <StyledChangeCardBody>
        <StyledCardBodyItem>
          <Body size="Small Bold">
            <FormattedMessage id="change-request-corrupted" />
          </Body>
        </StyledCardBodyItem>
      </StyledChangeCardBody>
    </StyledChangeCard>
  );
};

const StagingDataGroups = withTheme(
  ({
    headings,
    data,
    deleteStagingData,
    modalSizeAndPosition,
    retryStagingData,
  }) => {
    const [detailedViewData, setDetailedViewData] = useState(null);
    const [deleteFromStaging, setDeleteFromStaging] = useState(false);
    const [deleteUUID, setDeleteUUID] = useState();
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const windowSize = useWindowSize();
    const intl = useIntl();

    const changeGroupIsValid = changeGroup => {
      if (!changeGroup.diff) {
        return false;
      }

      if (!changeGroup.diff.original || !changeGroup.diff.change) {
        return false;
      }

      if (changeGroup.diff.change.length === 1 && !changeGroup.diff.change[0]) {
        return false;
      }

      if (
        changeGroup.diff.change.length === 2 &&
        (!changeGroup.diff.change[0] || !changeGroup.diff.change[1])
      ) {
        return false;
      }

      return true;
    };

    useEffect(() => {
      setHeight(
        windowSize.height - ref.current.getBoundingClientRect().top - 20,
      );
    }, [ref.current, windowSize.height, data]);

    const onDeleteStaging = uuid => {
      if (!deleteStagingData) return null;
      return () => {
        deleteStagingData(uuid);
        setDeleteFromStaging(false);
      };
    };

    const getTranslatedCardTitle = changeGroup => {
      const table = changeGroup.table.toLowerCase();
      const action = changeGroup.action.toLowerCase();
      let translationId = 'record';

      if (table === 'projects') {
        if (action === 'delete') {
          translationId = 'delete-project';
        } else if (action === 'update') {
          translationId = 'update-project';
        } else if (action === 'insert') {
          translationId = 'add-project';
        }
      } else if (table === 'units') {
        if (action === 'delete') {
          translationId = 'delete-unit';
        } else if (action === 'insert') {
          translationId = 'add-unit';
        } else if (action === 'update') {
          if (
            changeGroup.diff.change.length &&
            changeGroup.diff.change.length > 1
          ) {
            translationId = 'split-unit';
          } else {
            translationId = 'update-unit';
          }
        }
      }
      return intl.formatMessage({
        id: translationId,
      });
    };

    return (
      <StagingDataGroupsContainer ref={ref}>
        <div style={{ height: `${height}px`, overflow: 'auto' }}>
          {data &&
            headings &&
            data.map((changeGroup, index) => (
              <React.Fragment key={index}>
                {changeGroupIsValid(changeGroup) && (
                  <StyledChangeGroup>
                    {deleteStagingData && (
                      <StyledDeleteGroupIcon>
                        <div
                          onClick={() => {
                            setDeleteUUID(changeGroup.uuid);
                            setDeleteFromStaging(true);
                          }}
                        >
                          <MinusIcon width={20} height={20} />
                        </div>
                      </StyledDeleteGroupIcon>
                    )}
                    {retryStagingData && (
                      <StyledRetryGroupIcon>
                        <div onClick={() => retryStagingData(changeGroup.uuid)}>
                          <ReloadIcon width={18} height={18} />
                        </div>
                      </StyledRetryGroupIcon>
                    )}
                    {changeGroup.action === 'DELETE' && (
                      <ChangeCard
                        data={changeGroup.diff.original}
                        headings={headings}
                        onClick={() =>
                          setDetailedViewData({
                            record: changeGroup.diff.original,
                            title: getTranslatedCardTitle(changeGroup),
                            action: changeGroup.action,
                          })
                        }
                        title={getTranslatedCardTitle(changeGroup)}
                        displayInRed
                      />
                    )}
                    {changeGroup.action === 'INSERT' && (
                      <ChangeCard
                        data={changeGroup.diff.change[0]}
                        headings={headings}
                        title={getTranslatedCardTitle(changeGroup)}
                        onClick={() =>
                          setDetailedViewData({
                            record: changeGroup.diff.change[0],
                            title: getTranslatedCardTitle(changeGroup),
                            action: changeGroup.action,
                          })
                        }
                      />
                    )}
                    {changeGroup.action === 'UPDATE' && (
                      <ChangeCard
                        data={changeGroup.diff.original}
                        headings={getDiff(
                          changeGroup.diff.original,
                          changeGroup.diff.change[0],
                        )}
                        onClick={() =>
                          setDetailedViewData({
                            record: changeGroup.diff.original,
                            changes: changeGroup.diff.change,
                            title: getTranslatedCardTitle(changeGroup),
                            action: changeGroup.action,
                          })
                        }
                        title={getTranslatedCardTitle(changeGroup)}
                        deletedIsVsible
                        displayInRed
                      />
                    )}
                    {changeGroup.action === 'UPDATE' &&
                      changeGroup.diff.change.map((change, index) => (
                        <ChangeCard
                          key={index}
                          data={change}
                          headings={getDiff(changeGroup.diff.original, change)}
                          title={getTranslatedCardTitle(changeGroup)}
                          onClick={() =>
                            setDetailedViewData({
                              record: changeGroup.diff.original,
                              changes: changeGroup.diff.change,
                              title: getTranslatedCardTitle(changeGroup),
                              action: changeGroup.action,
                            })
                          }
                          addedIsVisible
                        />
                      ))}
                  </StyledChangeGroup>
                )}
                {!changeGroupIsValid(changeGroup) && (
                  <StyledChangeGroup>
                    <StyledDeleteGroupIcon>
                      <div
                        onClick={() => {
                          setDeleteUUID(changeGroup.uuid);
                          setDeleteFromStaging(true);
                        }}
                      >
                        <MinusIcon width={20} height={20} />
                      </div>
                    </StyledDeleteGroupIcon>
                    <InvalidChangeCard
                      title={intl.formatMessage({
                        id:
                          changeGroup.table.toLowerCase() === 'projects'
                            ? 'project'
                            : 'unit',
                      })}
                      onDeleteChangeGroup={() => {
                        setDeleteUUID(changeGroup.uuid);
                        setDeleteFromStaging(true);
                      }}
                    />
                  </StyledChangeGroup>
                )}
              </React.Fragment>
            ))}
          <StyledPaginationContainer>
            <APIStagingPagination actions="staging" formType={data} />
          </StyledPaginationContainer>
          {detailedViewData && (
            <DetailedViewStagingModal
              onClose={() => setDetailedViewData(null)}
              modalSizeAndPosition={modalSizeAndPosition}
              record={detailedViewData.record}
              changes={
                detailedViewData?.changes ? detailedViewData.changes : undefined
              }
              title={
                detailedViewData?.title ? detailedViewData.title : undefined
              }
              action={
                detailedViewData?.action ? detailedViewData.action : undefined
              }
            />
          )}
          {deleteFromStaging && (
            <Modal
              title={intl.formatMessage({
                id: 'notification',
              })}
              body={intl.formatMessage({
                id: 'confirm-deletion',
              })}
              modalType={modalTypeEnum.confirmation}
              onClose={() => setDeleteFromStaging(false)}
              onOk={onDeleteStaging(deleteUUID)}
            />
          )}
        </div>
      </StagingDataGroupsContainer>
    );
  },
);

export { StagingDataGroups };
