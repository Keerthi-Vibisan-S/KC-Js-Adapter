import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { AlertVariant, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { adminClient } from "../admin-client";
import { useAlerts } from "../components/alert/Alerts";
import { KeycloakSpinner } from "../components/keycloak-spinner/KeycloakSpinner";
import { RoleMapping } from "../components/role-mapping/RoleMapping";
import { useRealm } from "../context/realm-context/RealmContext";
import { useFetch } from "../utils/useFetch";
import { DefaultsGroupsTab } from "./DefaultGroupsTab";

import "./bootstrap.css";

export const CustTab = () => {
  const { t } = useTranslation("realm-settings");
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [activeTab, setActiveTab] = useState(11);
  const [key, setKey] = useState(0);

  const { addAlert, addError } = useAlerts();
  const { realm: realmName } = useRealm();

  useFetch(
    () => adminClient.realms.findOne({ realm: realmName }),
    setRealm,
    []
  );

  if (!realm) {
    return <KeycloakSpinner />;
  }

  const addComposites = async (composites: RoleRepresentation[]) => {
    const compositeArray = composites;

    try {
      await adminClient.roles.createComposite(
        { roleId: realm.defaultRole!.id!, realm: realmName },
        compositeArray
      );
      setKey(key + 1);
      addAlert(t("roles:addAssociatedRolesSuccess"), AlertVariant.success);
    } catch (error) {
      addError("roles:addAssociatedRolesError", error);
    }
  };

  return (
    <section className="p-4">
        <h3>This our new Custom Tab</h3>
       <div className="mb-3 w-25">
         <label htmlFor="formGroupExampleInput" className="form-label">Example label</label>
         <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Example input placeholder">
         </input>
       </div>
       <div className="mb-3 w-25">
         <label htmlFor="formGroupExampleInput2" className="form-label">Another label</label>
         <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Another input placeholder">
         </input>
       </div>
    </section>
  );
};
