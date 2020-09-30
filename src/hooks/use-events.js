import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getColonyNetworkClient,
  Network,
  getMultipleEvents,
  getLogs,
  getBlockTime,
} from "@colony/colony-js";
import { Wallet } from "ethers";
import { InfuraProvider } from "ethers/providers";

const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

const provider = new InfuraProvider();
const wallet = Wallet.createRandom();
const connectedWallet = wallet.connect(provider);

const EventsContext = createContext({});

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [colonyClient, setColonyClient] = useState(null);

  useEffect(() => {
    const getColonyClient = async () => {
      try {
        setIsLoading(true);
        const networkClient = await getColonyNetworkClient(
          Network.Mainnet,
          connectedWallet,
          MAINNET_NETWORK_ADDRESS
        );
        const colonyClient = await networkClient.getColonyClient(
          MAINNET_BETACOLONY_ADDRESS
        );
        setColonyClient(colonyClient);
      } catch (err) {
        setHasError(true);
      }
    };
    getColonyClient();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // @ts-ignore
        const {
          PayoutClaimed,
          ColonyInitialised,
          ColonyRoleSet,
          DomainAdded,
        } = colonyClient.filters;

        const payoutClaimedLogs = await getLogs(
          colonyClient,
          PayoutClaimed(null, null, null)
        );

        const payoutClaimedEvents = payoutClaimedLogs.map((log) => {
          const event = colonyClient.interface.parseLog(log);
          return { ...event, ...log };
        });

        const colonyInitialisedLogs = await getLogs(
          colonyClient,
          ColonyInitialised(null, null)
        );
        const colonyInitialisedEvents = colonyInitialisedLogs.map((log) => {
          const event = colonyClient.interface.parseLog(log);
          return { ...event, ...log };
        });

        const colonyRoleSetLogs = await getLogs(colonyClient, ColonyRoleSet());
        const colonyRoleSetEvents = colonyRoleSetLogs.map((log) => {
          const event = colonyClient.interface.parseLog(log);
          return { ...event, ...log };
        });

        const domainAddedSetLogs = await getLogs(
          colonyClient,
          DomainAdded(null)
        );
        const domainAddedSetEvents = domainAddedSetLogs.map((log) => {
          const event = colonyClient.interface.parseLog(log);
          return { ...event, ...log };
        });

        const mergedEvents = [
          ...payoutClaimedEvents,
          ...colonyInitialisedEvents,
          ...colonyRoleSetEvents,
          ...domainAddedSetEvents,
        ];
        setEvents(mergedEvents.reverse());
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [colonyClient]);

  return (
    <EventsContext.Provider
      value={{
        isLoading,
        colonyClient,
        events,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
EventsProvider.propTypes = {
  children: PropTypes.node,
};

export const useEvents = () => {
  const { isLoading, events, colonyClient } = useContext(EventsContext);

  const getEventDate = async (blockHash) => {
    let loading = false;
    let time;
    let error = false;
    try {
      loading = true;
      time = await getBlockTime(colonyClient.provider, blockHash);
    } catch (error) {
      error = error;
    } finally {
      loading = false;
    }

    return { time, loading, error };
  };

  const getUserAddress = async (humanReadableFundingPotId) => {
    let loading = false;
    let userAddress;
    let error = false;
    try {
      loading = true;
      const { associatedTypeId } = await colonyClient.getFundingPot(
        humanReadableFundingPotId
      );
      const payment = await colonyClient.getPayment(associatedTypeId);
      userAddress = payment.recipient;
    } catch (error) {
      error = error;
    } finally {
      loading = false;
    }

    return { userAddress, loading, error };
  };

  return {
    isLoading,
    events,
    colonyClient,
    getEventDate,
    getUserAddress,
  };
};
