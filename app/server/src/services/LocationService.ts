import { PrismaClient } from "@prisma/client";
import { InvariantError, NotFoundError } from "../common/exception";

export class LocationService {
  constructor(public prismaClient: PrismaClient) {}

  async addProvince(name: string) {
    const { province } = await this.getProvinceByName(name);
    if (!!province) {
      throw new InvariantError(`Province ${name} is already exist`);
    }
    const newProvince = await this.prismaClient.province.create({
      data: {
        name,
      },
    });
    return { province: newProvince };
  }

  async getProvinceByName(name: string) {
    const province = await this.prismaClient.province.findFirst({
      where: {
        name: name.toLowerCase(),
      },
    });
    return { province };
  }

  async updateProvinceById(id: number, name: string) {
    const { province } = await this.getProvinceById(id);
    if (!province) {
      throw new NotFoundError(`Province with id ${id} is not found`);
    }

    const updatedProvince = await this.prismaClient.province.update({
      where: {
        id,
      },
      data: {
        name: name.toLocaleLowerCase(),
      },
    });

    return { province: updatedProvince };
  }

  async getProvinceById(id: number) {
    const province = await this.prismaClient.province.findUnique({
      where: {
        id,
      },
    });

    return { province };
  }

  async deleteProvinceById(id: number) {
    const { province } = await this.getProvinceById(id);
    if (!province) {
      throw new NotFoundError(`Province with id ${id} is not found`);
    }

    const deletedProvince = await this.prismaClient.province.delete({
      where: {
        id,
      },
    });

    return {
      province: deletedProvince,
    };
  }

  async getProvinces(name?: string) {
    const provinces = await this.prismaClient.province.findMany({
      ...(name && {
        where: {
          name: {
            contains: name.toLowerCase(),
          },
        },
      }),
      include: {
        cities: true,
      },
    });
    return { provinces };
  }

  async addCity(name: string, provinceId: number) {
    const { city } = await this.getCityByName(name);
    if (!!city) {
      throw new InvariantError(`City ${name} is already exist`);
    }
    const newCity = await this.prismaClient.city.create({
      data: {
        name,
        province_id: provinceId,
      },
    });
    return { city: newCity };
  }

  async getCityByName(name: string) {
    const city = await this.prismaClient.city.findFirst({
      where: {
        name: name.toLowerCase(),
      },
    });
    return { city };
  }

  async updateCityById(
    id: number,
    payload: { name: string; provinceId: number }
  ) {
    const { city } = await this.getCityById(id);
    if (!city) {
      throw new NotFoundError(`city with id ${id} is not found`);
    }

    const updatedCity = await this.prismaClient.city.update({
      where: {
        id,
      },
      data: {
        name: payload.name.toLocaleLowerCase(),
        province_id: payload.provinceId,
      },
    });

    return { city: updatedCity };
  }

  async getCityById(id: number) {
    const city = await this.prismaClient.city.findUnique({
      where: {
        id,
      },
    });

    return { city };
  }

  async deleteCityById(id: number) {
    const { city } = await this.getCityById(id);
    if (!city) {
      throw new NotFoundError(`city with id ${id} is not found`);
    }

    const deletedcity = await this.prismaClient.city.delete({
      where: {
        id,
      },
    });

    return {
      city: deletedcity,
    };
  }

  async getCities(name?: string) {
    const cities = await this.prismaClient.city.findMany({
      ...(name && {
        where: {
          name: {
            contains: name.toLowerCase(),
          },
        },
      }),
      include: {
        province: true,
      },
    });
    return { cities };
  }
}
