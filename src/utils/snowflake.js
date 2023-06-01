import { Snowflake } from "nodejs-snowflake";

const snowflake = new Snowflake({ custom_epoch: 1672531200000, instance_id: 0 });

export default function newID() {
    return snowflake.getUniqueID().toString();
}
