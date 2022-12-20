import pandas as pd
import numpy as np
from cesium_entity import CesiumEntity
from .parser import Parser

class CSVParser(Parser):
    def __init__(self):
        super().__init__()
        self.name = "csv_parser"
        self.initDefaultEntitiy()
        self.initEntities()

    def parse(self,filename):
        csv = pd.read_csv(filename)
        start_time = pd.to_datetime(csv['timestamp'][0])
        time_delta = (pd.to_datetime(csv['timestamp']) - start_time)
        seconds = time_delta / np.timedelta64(1, 's')
        micro_seconds = time_delta / np.timedelta64(1, 'us')
        csv['timestamp'] = micro_seconds
        csv['timestamp_tiplot'] = seconds
        self.datadict = {"data": csv} 
        return [self.datadict, self.entities]

    def initDefaultEntitiy(self):
        self.default_entity = CesiumEntity(
            color="#ffffff",
            pathColor="#0000ff",
            name='csv default entity',
            alpha=1,
            useRPY=True,
            useXYZ=False,
            position={
                'table':'data',
                'longitude':'lon',
                'lattitude':'lat',
                'altitude':'altitude',
            },
            attitude={
                'table':'data',
                'roll':'roll',
                'pitch':'pitch',
                'yaw':'yaw',
            })


    def setDefaultEntities(self):
        self.addEntity(self.default_entity)